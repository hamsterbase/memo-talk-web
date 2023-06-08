import React, { useEffect, useState } from 'react';
import { MemoTalk, MemoTalkCore } from './core/memo-talk-core.ts';
import { MemoTalkContainer } from './memo-talk.tsx';

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
        props.memoTalkCore.createMemoTalk(content);
        setMemoTalks(props.memoTalkCore.getMemoTalkList());
      }}
    />
  );
};
