import MoreOne from '@icon-park/react/es/icons/MoreOne';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import styles from './mem-talk.module.css';

interface MemoTalk {
  id: string;
  content: string;
  createTime: number;
}

interface Props {
  memoTalks: MemoTalk[];
  dominantHand: 'left' | 'right';
  onClick(id: string): void;
}

const MemoTalkContainer: React.FC<Props> = ({
  memoTalks,
  onClick,
  dominantHand,
}) => {
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

  return (
    <div ref={container} className={styles.messages}>
      {memoTalks.map((memoTalk) => (
        <div
          id={memoTalk.id}
          key={memoTalk.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className={styles.message}>
            {memoTalk.content}
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
      ))}
    </div>
  );
};

export { MemoTalkContainer };
