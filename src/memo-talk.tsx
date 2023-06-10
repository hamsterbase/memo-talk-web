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

  onClick(id: string): void;
}

const MemoTalkContainer: React.FC<Props> = ({ memoTalks, onClick }) => {
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
          <div
            style={{
              textAlign: 'center',
              padding: 8,
              color: 'rgb(128,128,128)',
            }}
          >
            {dayjs(memoTalk.createTime).format('MM-DD hh:mm')}
          </div>
          <div
            className={styles.message}
            onClick={() => {
              onClick(memoTalk.id);
            }}
          >
            {memoTalk.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export { MemoTalkContainer };
