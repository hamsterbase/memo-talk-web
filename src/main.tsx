import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app.tsx';
import { MemoTalkCore } from './core/memo-talk-core.ts';

const memoTalkCore = new MemoTalkCore();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App memoTalkCore={memoTalkCore}></App>
  </React.StrictMode>
);
