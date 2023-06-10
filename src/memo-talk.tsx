import React, { useEffect, useRef } from 'react';
import styles from './mem-talk.module.css';
import dayjs from 'dayjs';

interface MemoTalk {
  id: string;
  content: string;
  createTime: number;
}

interface Props {
  memoTalks: MemoTalk[];
}

const MemoTalkContainer: React.FC<Props> = ({ memoTalks }) => {
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
          key={memoTalk.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ textAlign: 'center', padding: 8 }}>
            {dayjs(memoTalk.createTime).format('MM-DD mm:ss')}
          </div>
          <div className={styles.message}>{memoTalk.content}</div>
        </div>
      ))}
    </div>
  );
};

export { MemoTalkContainer };
