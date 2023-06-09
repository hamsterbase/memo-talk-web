import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './application.tsx';
import {
  ISettingService,
  IndexedDBSettingService,
} from '../../core/storage.ts';

const settingService: ISettingService = new IndexedDBSettingService();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App settingService={settingService}></App>
  </React.StrictMode>
);
