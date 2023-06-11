import { MemotalkContext } from '@/context.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initServices } from '../create-services.ts';
import { App } from './application.tsx';

const instantiationService = initServices();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MemotalkContext.Provider
      value={{
        instantiationService,
      }}
    >
      <App />
    </MemotalkContext.Provider>
  </React.StrictMode>
);
