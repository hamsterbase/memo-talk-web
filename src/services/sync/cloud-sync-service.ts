import { IMemoTalkCore } from '@/core/memo-talk-core';
import { FileAPISDK } from '@/pages/home/sdk';
import {
  decryptData,
  encryptData,
  generateKeys,
  sha256,
} from '@/pages/home/utils';
import { Emitter, Event } from 'vscf/base/common/event.ts';
import {
  ISettingService,
  StorageKeys,
  defaultSettingValue,
} from '../../core/storage';
import { createDecorator } from '@/vscf/platform/instantiation/common';

export enum SyncStatus {
  Default = -1, // The default status.
  Start = 0, // The synchronization process begins.
  FetchFiles = 1, // Fetching files from the server.
  DownloadFiles = 2, // Downloading files from the server.
  UploadChanges = 3, // Uploading changes to the server.
  RemoveMerged = 4, // Removing merged files from the system.
}

function sleep(s: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export interface ICloudSyncService {
  status: SyncStatus;

  sync(): Promise<void>;

  onStatusChange: Event<void>;
}

export function getProcessStatus(status: SyncStatus) {
  return ((status + 1) * 100) / (SyncStatus.RemoveMerged + 1);
}

export class CloudSyncService implements ICloudSyncService {
  private _status: SyncStatus = SyncStatus.Default;

  get status(): SyncStatus {
    return this._status;
  }

  private _onStatusChange: Emitter<void> = new Emitter();

  public onStatusChange = this._onStatusChange.event;

  private _syncTask: Promise<void> | null = null;

  constructor(
    @ISettingService private settingService: ISettingService,
    @IMemoTalkCore private memoTalkCore: IMemoTalkCore
  ) {}

  async sync(): Promise<void> {
    if (!this._syncTask) {
      this._syncTask = this.syncTaskWithDelay();
    }
    return this._syncTask;
  }

  private async syncTaskWithDelay() {
    const result = await this.doSync();
    if (result) {
      // await sleep(60);
    }
    this._syncTask = null;
    return;
  }

  private async doSync(): Promise<boolean> {
    console.log('sync');
    const config = await this.settingService.readConfig(defaultSettingValue);
    const url = config[StorageKeys.hamsterbaseURL];
    const username = config[StorageKeys.hamsterUsername];
    const password = config[StorageKeys.hamsterPassword];
    if (!url || !username || !password) {
      return false;
    }
    this.updateStatus(SyncStatus.Start);
    const sdk = new FileAPISDK(url);
    // 生成加密密钥
    // userToken 用来标记用户身份，也是服务器文件夹的名字
    // encryptionKey 是文件加密密码， encryptionKey 不会发送到服务
    const { userToken, encryptionKey } = generateKeys(username, password);
    const currentDatabaseHash = sha256(this.memoTalkCore.encode());
    this.updateStatus(SyncStatus.FetchFiles);

    // 获取服务器数据库列表
    const originalRemoteDatabaseList: string[] = await sdk.getList(userToken);

    //计算当前数据库的 hash

    const remoteDatabaseList = originalRemoteDatabaseList.filter(
      (hash) => hash !== currentDatabaseHash
    );

    if (
      remoteDatabaseList.length === 0 &&
      originalRemoteDatabaseList.length !== 0
    ) {
      this.updateStatus(SyncStatus.Default);
      return false;
    }

    this.updateStatus(SyncStatus.DownloadFiles);
    const cleanList: string[] = [];
    /**
     * 1. 下载文件
     * 2. 解密文件
     */
    for (const remoteDatabaseHash of remoteDatabaseList) {
      let remoteDatabaseContent: string | null;
      try {
        remoteDatabaseContent = await sdk.getFile(
          userToken,
          remoteDatabaseHash
        );
      } catch (error) {
        console.log('fetch ', remoteDatabaseHash, 'error');
        continue;
      }
      try {
        const data = decryptData(remoteDatabaseContent, encryptionKey);
        this.memoTalkCore.merge(data);
        cleanList.push(remoteDatabaseHash);
      } catch (error) {
        cleanList.push(remoteDatabaseHash);
        console.log(error);
        continue;
      }
    }
    this.updateStatus(SyncStatus.UploadChanges);
    const currentDatabaseHashAfterMerge = this.memoTalkCore.encode();
    //因为文件名是根据文件内容生成的，所以先生成文件名
    const fileName = sha256(currentDatabaseHashAfterMerge);
    // 获取本地最新数据，加密
    const currentData = encryptData(
      currentDatabaseHashAfterMerge,
      encryptionKey
    );
    try {
      // 把加密后的文档存到服务器
      await sdk.createFile(userToken, fileName, currentData);
      this.updateStatus(SyncStatus.RemoveMerged);
      // 因为数据已经合并到本地了，所以把服务器的删掉
      for (const waitClean of cleanList) {
        try {
          await sdk.deleteFile(userToken, waitClean);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      //忽略
    }
    this.updateStatus(SyncStatus.Default);
    return true;
  }

  private updateStatus(status: SyncStatus) {
    this._status = status;
    this._onStatusChange.fire();
  }
}

export const ICloudSyncService =
  createDecorator<ICloudSyncService>('ICloudSyncService');
