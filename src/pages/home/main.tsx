import { MemotalkContext } from '@/context.ts';
import { IMemoTalkService } from '@/services/note/node-service.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../global.css';
import { initServices } from '../create-services.ts';
import { App } from './application.tsx';
import { ICloudSyncService } from '@/services/sync/cloud-sync-service.ts';

async function start() {
  const instantiationService = initServices();

  const { memoTalkService, cloudSyncService } =
    instantiationService.invokeFunction((v) => {
      return {
        memoTalkService: v.get(IMemoTalkService),
        cloudSyncService: v.get(ICloudSyncService),
      };
    });
  memoTalkService.init();
  cloudSyncService.sync();

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <MemotalkContext.Provider
        value={{
          instantiationService,
        }}
      >
        <App />
      </MemotalkContext.Provider>
      ,
    </React.StrictMode>
  );
}

start();
