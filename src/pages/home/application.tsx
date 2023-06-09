import { NavBar } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React, { useEffect, useState } from 'react';
import { MemoTalk, MemoTalkCore } from '../../core/memo-talk-core.ts';
import { MemoTalkContainer } from '../../memo-talk.tsx';

export interface Props {
  memoTalkCore: MemoTalkCore;
}

export const App: React.FC<Props> = (props) => {
  const [memoTalks, setMemoTalks] = useState<MemoTalk[]>([]);

  const handleGoSetting = () => {
    window.location.href = '/settings/index.html';
  };

  useEffect(() => {
    setMemoTalks(props.memoTalkCore.getMemoTalkList());
  }, [props.memoTalkCore]);

  return (
    <div>
      <NavBar
        back={null}
        right={
          <div style={{ fontSize: 24 }}>
            <MoreOutline onClick={handleGoSetting} />
          </div>
        }
      >
        Memo Chat
      </NavBar>
      <MemoTalkContainer
        memoTalks={memoTalks}
        onCreateMemoTalk={(content: string) => {
          props.memoTalkCore.createMemoTalk(content);
          setMemoTalks(props.memoTalkCore.getMemoTalkList());
        }}
      />
    </div>
  );
};