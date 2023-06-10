import { ActionSheet, Button, NavBar, SafeArea, TextArea } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React, { useEffect, useRef, useState } from 'react';
import { MemoTalk, MemoTalkCore } from '../../core/memo-talk-core.ts';
import { MemoTalkContainer } from '../../memo-talk.tsx';
import styles from './application.module.css';
import './main.tsx';

export interface Props {
  memoTalkCore: MemoTalkCore;
}

const useInnerHight = () => {
  const [innerHeight, setHeight] = useState<number>(window.innerHeight);
  useEffect(() => {
    const onViewportResize = () => {
      const viewportHeight = window.innerHeight;
      setHeight(viewportHeight);
    };

    window.addEventListener('resize', onViewportResize);
    return () => window.removeEventListener('reset', onViewportResize);
  });
  return { innerHeight };
};

const useFooterHeight = (innerHeight: number) => {
  const [footerHeight, setPaddingBottom] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const footerElement = ref.current;
    new ResizeObserver(() => {
      const rect = footerElement.getBoundingClientRect();
      setPaddingBottom(innerHeight - rect.top);
    }).observe(footerElement);
  }, [innerHeight]);

  return {
    footerRef: ref,
    footerHeight,
  };
};

export const App: React.FC<Props> = (props) => {
  const [memoTalks, setMemoTalks] = useState<MemoTalk[]>([]);
  const [inputValue, setInputValue] = useState('');

  const { innerHeight } = useInnerHight();

  const handleGoSetting = () => {
    window.location.href = '/settings/index.html';
  };

  const { footerHeight, footerRef } = useFooterHeight(innerHeight);

  const [clickMessage, setClickMessage] = useState<string | null>(null);

  const contentHeight = innerHeight - 45 - 20 - footerHeight;

  useEffect(() => {
    setMemoTalks(props.memoTalkCore.getMemoTalkList());
    props.memoTalkCore.onUpdate(() => {
      setMemoTalks(props.memoTalkCore.getMemoTalkList());
    });
  }, [props.memoTalkCore]);

  return (
    <div
      style={{
        background: '#F7F8FA',
      }}
    >
      <NavBar
        back={null}
        right={
          <div style={{ fontSize: 24 }}>
            <MoreOutline onClick={handleGoSetting} />
          </div>
        }
      >
        Memotalk
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
      <div style={{ color: 'red', textAlign: 'center', height: 20 }}>
        此项目还在开发中，请不要使用
      </div>
      <div
        style={{
          height: contentHeight,
        }}
      >
        <MemoTalkContainer
          memoTalks={memoTalks}
          onClick={(id) => {
            setClickMessage(id);
          }}
        />
      </div>
      <div style={{ height: footerHeight, width: '100%' }}></div>
      <div ref={footerRef} className={styles.footer}>
        <div
          style={{
            borderRadius: 8,
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            background: 'white',
            flexDirection: 'column',
            padding: 8,
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
            style={{
              flexShrink: 0,
              position: 'relative',
              background: 'white',
              marginTop: 8,
            }}
          >
            <Button
              disabled={!inputValue.trim()}
              color="primary"
              size="small"
              onClick={() => {
                const ud = props.memoTalkCore.createMemoTalk(inputValue);
                setMemoTalks(props.memoTalkCore.getMemoTalkList());
                setInputValue('');
                setTimeout(() => {
                  document.getElementById(ud)?.scrollIntoView();
                }, 10);
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
