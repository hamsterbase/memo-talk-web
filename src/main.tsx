import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MemoTalkCore } from './core/memo-talk-core.ts';

const memoTalkCore = new MemoTalkCore();

memoTalkCore.createMemoTalk('one');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      memoTalks={memoTalkCore.getMemoTalkList()}
      onCreateMemoTalk={(content: string) => {
        memoTalkCore.createMemoTalk(content);
      }}
    />
  </React.StrictMode>
);
