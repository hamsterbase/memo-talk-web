import { Button, NavBar, SafeArea, TextArea } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React, { useEffect, useState } from 'react';
import { MemoTalk, MemoTalkCore } from '../../core/memo-talk-core.ts';
import { MemoTalkContainer } from '../../memo-talk.tsx';
import '../../global.css';
import styles from './application.module.css';

export interface Props {
  memoTalkCore: MemoTalkCore;
}

export const App: React.FC<Props> = (props) => {
  const [memoTalks, setMemoTalks] = useState<MemoTalk[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleGoSetting = () => {
    window.location.href = '/settings/index.html';
  };

  useEffect(() => {
    setMemoTalks(props.memoTalkCore.getMemoTalkList());

    props.memoTalkCore.onUpdate(() => {
      setMemoTalks(props.memoTalkCore.getMemoTalkList());
    });
  }, [props.memoTalkCore]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
      <div style={{ color: 'red' }}>此项目还在开发中，请不要使用</div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MemoTalkContainer memoTalks={memoTalks} />
      </div>
      <div className={styles.footer} id="footer">
        <div
          style={{
            border: '1px solid #333',
            borderRadius: 8,
            padding: 8,
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
          }}
        >
          <TextArea
            rows={1}
            autoSize
            value={inputValue}
            onChange={(v) => {
              setInputValue(v);
            }}
          ></TextArea>
          <div
            style={{ flexShrink: 0, position: 'relative', background: 'white' }}
          >
            <Button
              disabled={!inputValue.trim()}
              color="primary"
              size="small"
              onClick={() => {
                props.memoTalkCore.createMemoTalk(inputValue);
                setMemoTalks(props.memoTalkCore.getMemoTalkList());
                setInputValue('');
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 100,
              }}
            >
              <span>发送</span>
            </Button>
          </div>
        </div>
        <SafeArea position="bottom"></SafeArea>
      </div>
    </div>
  );
};
