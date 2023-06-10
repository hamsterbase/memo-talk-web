import { ActionSheet, Button, NavBar, SafeArea, TextArea } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React, { useEffect, useRef, useState } from 'react';
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

  const [paddingBottom, setPaddingBottom] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const handleGoSetting = () => {
    window.location.href = '/settings/index.html';
  };

  const [clickMessage, setClickMessage] = useState<string | null>(null);

  useEffect(() => {
    setMemoTalks(props.memoTalkCore.getMemoTalkList());
    props.memoTalkCore.onUpdate(() => {
      setMemoTalks(props.memoTalkCore.getMemoTalkList());
    });
  }, [props.memoTalkCore]);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const distanceToBottom = window.innerHeight - rect.top;
    setPaddingBottom(distanceToBottom + 8);
  }, [inputValue]);

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
      <ActionSheet
        visible={!!clickMessage}
        actions={[
          {
            text: '删除',
            key: 'delete',
            danger: true,
            bold: true,
            onClick: () => {
              props.memoTalkCore.deleteMemoTalkById(clickMessage!);
              setClickMessage(null);
            },
          },
        ]}
        onClose={() => setClickMessage(null)}
      />
      <div style={{ color: 'red', textAlign: 'center' }}>
        此项目还在开发中，请不要使用
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MemoTalkContainer
          memoTalks={memoTalks}
          onClick={(id) => {
            setClickMessage(id);
          }}
        />
      </div>
      <div style={{ height: paddingBottom, width: '100%' }}></div>
      <div ref={ref} className={styles.footer}>
        <div
          style={{
            borderRadius: 8,
            padding: 8,
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            background: 'rgb(244,244,244)',
          }}
        >
          <TextArea
            placeholder="随便说一点"
            rows={2}
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
                background: 'black',
                color: 'white',
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
