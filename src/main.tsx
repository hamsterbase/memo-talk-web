import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './application.tsx';
import { MemoTalkCore } from './core/memo-talk-core.ts';

const memoTalkCore = new MemoTalkCore();

if (localStorage.getItem('memoTalks')) {
  memoTalkCore.merge(localStorage.getItem('memoTalks') as string);
}

memoTalkCore.onUpdate(() => {
  localStorage.setItem('memoTalks', memoTalkCore.encode());
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App memoTalkCore={memoTalkCore}></App>
  </React.StrictMode>
);
