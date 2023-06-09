import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoTalkCore } from '../../core/memo-talk-core.ts';
import {
  DatabaseKey,
  ISettingService,
  IndexedDBSettingService,
} from '../../core/storage.ts';
import { App } from './application.tsx';

const memoTalkCore = new MemoTalkCore();
const settingService: ISettingService = new IndexedDBSettingService();

const initValue = await settingService.get(DatabaseKey, '');

if (initValue) {
  memoTalkCore.merge(initValue);
}

memoTalkCore.onUpdate(() => {
  settingService.set(DatabaseKey, memoTalkCore.encode());
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App memoTalkCore={memoTalkCore}></App>
  </React.StrictMode>
);
