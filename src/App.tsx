import React, { useEffect, useState } from 'react';
import { MemoTalk, MemoTalkCore } from './core/memo-talk-core.ts';
import { MemoTalkContainer } from './memo-talk.tsx';

const memoTalkCore = new MemoTalkCore();

export interface Props {
  memoTalkCore: MemoTalkCore;
}

export const App: React.FC<Props> = (props) => {
  const [memoTalks, setMemoTalks] = useState<MemoTalk[]>([]);

  useEffect(() => {
    setMemoTalks(props.memoTalkCore.getMemoTalkList());
  }, [props.memoTalkCore]);

  return (
    <MemoTalkContainer
      memoTalks={memoTalks}
      onCreateMemoTalk={(content: string) => {
        memoTalkCore.createMemoTalk(content);
        setMemoTalks(memoTalkCore.getMemoTalkList());
      }}
    />
  );
};
