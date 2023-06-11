import MoreOne from '@icon-park/react/es/icons/MoreOne';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { useEventRender } from './hooks/use-event-render';
import { useService } from './hooks/use-service';
import styles from './mem-talk.module.css';
import { IMemoTalkService } from './services/note/node-service';
import ReactMarkdown from 'react-markdown';

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

interface LinkProps {
  href?: string;
  children: any;
}

const Link: React.FC<LinkProps> = (props) => {
  return (
    <a href={props.href} target="_blank">
      {props.children}
    </a>
  );
};

const MemoTalkContainer: React.FC<Props> = ({
  memoTalks,
  onClick,
  dominantHand,
}) => {
  const container = useRef<HTMLDivElement | null>(null);

  const value = useRef(0);

  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);

  useEffect(() => {
    memoTalkService.onStatusChange((s) => {
      if (s.type === 'create') {
        console.log('create');
        setTimeout(() => {
          document.getElementById(s.id)?.scrollIntoView();
        }, 20);
      }
    });

    memoTalkService.onStatusChange((s) => {
      if (s.type === 'init') {
        const last =
          memoTalkService.memoTalkList[memoTalkService.memoTalkList.length - 1];
        if (last) {
          setTimeout(() => {
            document.getElementById(last.id)?.scrollIntoView();
          }, 10);
        }
      }
    });
  }, [memoTalkService]);

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
            <ReactMarkdown className={styles.markdown} components={{ a: Link }}>
              {memoTalk.content}
            </ReactMarkdown>
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
