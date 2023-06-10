import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoTalkCore } from '../../core/memo-talk-core.ts';
import {
  DatabaseKey,
  ISettingService,
  IndexedDBSettingService,
  StorageKeys,
  defaultSettingValue,
} from '../../core/storage.ts';
import { App } from './application.tsx';
import { FileAPISDK } from './sdk.ts';
import { decryptData, encryptData, generateKeys, sha256 } from './utils.ts';
import '../../global.css';

async function start() {
  const memoTalkCore = new MemoTalkCore();
  const settingService: ISettingService = new IndexedDBSettingService();
  const initValue = await settingService.get(DatabaseKey, '');

  if (initValue) {
    memoTalkCore.merge(initValue);
  }
  async function sync() {
    const config = await settingService.readConfig(defaultSettingValue);

    const url = config[StorageKeys.hamsterbaseURL];
    const username = config[StorageKeys.hamsterUsername];
    const passowrd = config[StorageKeys.hamsterPassword];
    if (!url || !username || !passowrd) {
      return;
    }
    const sdk = new FileAPISDK(url);

    // 生成加密密钥
    // userToken 用来标记用户身份，也是服务器文件夹的名字
    // encryptionKey 是文件加密密码， encryptionKey 不会发送到服务
    const { userToken, encryptionKey } = generateKeys(username, passowrd);

    // 获取服务器数据库列表
    const files: string[] = await sdk.getList(userToken);

    const currentHash = sha256(memoTalkCore.encode());

    const mergedFiles: string[] = [];

    // 把服务器上的文件和本地合并，合并后加入等待删除列表
    for (const file of files.filter((o) => currentHash !== o)) {
      try {
        const remoteData = await sdk.getFile(userToken, file);
        const database = decryptData(remoteData, encryptionKey);
        memoTalkCore.merge(database);
        mergedFiles.push(file);
      } catch (error) {
        console.log(error);
      }
    }

    const currentFile = memoTalkCore.encode();

    //因为文件名是根据文件内容生成的，所以先生成文件名
    const fileName = sha256(currentFile);

    // 获取本地最新数据，加密
    const currentData = encryptData(currentFile, encryptionKey);

    // 把加密后的文档存到服务器
    await sdk.createFile(userToken, fileName, currentData);

    // 因为数据已经合并到本地了，所以把服务器的删掉
    for (const mergedFile of mergedFiles) {
      try {
        await sdk.deleteFile(userToken, mergedFile);
      } catch (error) {
        console.log(error);
      }
    }
  }
  sync().catch(console.log);
  memoTalkCore.onUpdate(() => {
    settingService.set(DatabaseKey, memoTalkCore.encode());
  });

  const settings = await settingService.readConfig(defaultSettingValue);
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App memoTalkCore={memoTalkCore} settings={settings}></App>
    </React.StrictMode>
  );
}

start();
