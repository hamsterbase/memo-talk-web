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
import CryptoJS from 'crypto-js';

const memoTalkCore = new MemoTalkCore();
const settingService: ISettingService = new IndexedDBSettingService();

const initValue = await settingService.get(DatabaseKey, '');

if (initValue) {
  memoTalkCore.merge(initValue);
}

memoTalkCore.onUpdate(() => {
  settingService.set(DatabaseKey, memoTalkCore.encode());
});

async function sync() {
  const config = await settingService.readConfig(defaultSettingValue);

  const url = config[StorageKeys.hamsterbaseURL];
  const username = config[StorageKeys.hamsterUsername];
  const passowrd = config[StorageKeys.hamsterPassword];

  `sha256(memo:sha256(username):sha256(password):talk)`;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App memoTalkCore={memoTalkCore}></App>
  </React.StrictMode>
);
