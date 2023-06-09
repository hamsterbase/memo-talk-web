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
    const { userToken, encryptionKey } = generateKeys(username, passowrd);

    // 获取服务器数据库列表
    const files: string[] = await sdk.getList(userToken);

    const mergedFiles: string[] = [];
    for (const file of files) {
      try {
        const remoteData = await sdk.getFile(userToken, file);
        const database = decryptData(remoteData, encryptionKey);
        memoTalkCore.merge(database);
        mergedFiles.push(file);
      } catch (error) {
        console.log(error);
      }
    }

    // 加密数据
    const currentData = encryptData(memoTalkCore.encode(), encryptionKey);
    const fileName = sha256(currentData);
    await sdk.createFile(userToken, fileName, currentData);
    for (const mergedFile of mergedFiles) {
      try {
        await sdk.deleteFile(userToken, mergedFile);
      } catch (error) {
        console.log(error);
      }
    }
  }
  sync().then(console.log).catch(console.log);
  memoTalkCore.onUpdate(() => {
    settingService.set(DatabaseKey, memoTalkCore.encode());
  });
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App memoTalkCore={memoTalkCore}></App>
    </React.StrictMode>
  );
}

start();
