import MoreOne from '@icon-park/react/es/icons/MoreOne';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { Markdown } from './components/markdown/markdown';
import { useService } from './hooks/use-service';
import styles from './mem-talk.module.css';
import { IMemoTalkService } from './services/note/node-service';

import { MemoTalk } from './core/memo-talk-core';

interface Props {
  dominantHand: string;
  onClick(id: string): void;
}

const MemoTalkContainerNative: React.FC<Props> = ({
  onClick,
  dominantHand,
}) => {
  const memoTalkService = useService(IMemoTalkService);
  const container = useRef<HTMLDivElement | null>(null);

  const value = useRef(0);

  useEffect(() => {
    if (!container.current) {
      return;
    }
    const containerElement = container.current;
    new ResizeObserver(() => {
      containerElement.scrollTop =
        containerElement.scrollHeight -
        value.current -
        containerElement.clientHeight;
    }).observe(containerElement);

    containerElement.onscroll = () => {
      value.current =
        containerElement.scrollHeight -
        containerElement.clientHeight -
        containerElement.scrollTop;
    };
  }, []);

  useEffect(() => {
    function scroll(id: string) {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView();
      }, 100);
    }

    if (memoTalkService.memoTalkList.length > 0) {
      scroll(
        memoTalkService.memoTalkList[memoTalkService.memoTalkList.length - 1].id
      );
    }

    memoTalkService.onStatusChange((e) => {
      if (e.type === 'create') {
        scroll(e.id);
        return;
      }
    });
  }, [memoTalkService]);

  const native = (memoTalk: MemoTalk) => {
    return (
      <div id={memoTalk.id} key={memoTalk.id}>
        <div
          key={memoTalk.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className={styles.message}>
            <Markdown content={memoTalk.content}></Markdown>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 8,
              }}
            >
              {dominantHand === 'right' && (
                <div className={styles.time}>
                  {dayjs(memoTalk.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              )}
              <MoreOne
                className={styles['icon-left']}
                style={{
                  transform: 'transformX(-4px)',
                }}
                size={18}
                onClick={() => {
                  onClick(memoTalk.id);
                }}
              />
              {dominantHand === 'left' && (
                <div className={styles.time}>
                  {dayjs(memoTalk.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={container} className={styles.messages}>
      {memoTalkService.memoTalkList.map((memoTalk) => native(memoTalk))}
    </div>
  );
};

export { MemoTalkContainerNative };
