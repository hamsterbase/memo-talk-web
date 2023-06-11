import MoreOne from '@icon-park/react/es/icons/MoreOne';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { Markdown } from './components/markdown/markdown';
import { useEventRender } from './hooks/use-event-render';
import { useService } from './hooks/use-service';
import styles from './mem-talk.module.css';
import { IMemoTalkService } from './services/note/node-service';

import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';

interface Props {
  dominantHand: string;
  onClick(id: string): void;
}

const MemoTalkContainer: React.FC<Props> = ({ onClick, dominantHand }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
    })
  );

  const listRef = useRef<List | null>(null);

  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);

  useEffect(() => {
    if (memoTalkService.memoTalkList.length > 0) {
      const rea = memoTalkService.memoTalkList.length - 1;
      setTimeout(() => {
        listRef.current?.scrollToRow(rea);
      });
      setTimeout(() => {
        listRef.current?.scrollToRow(rea);
      }, 150);
    }

    memoTalkService.onStatusChange((e) => {
      if (e.type === 'init') {
        listRef.current?.scrollToRow(memoTalkService.memoTalkList.length - 1);
      }
      if (e.type === 'create') {
        listRef.current?.scrollToRow(memoTalkService.memoTalkList.length - 1);
      }
    });
  }, [memoTalkService]);

  const rowRenderer = ({
    index,
    key,
    parent,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
    key: string;
    parent: unknown;
  }) => {
    const memoTalk = memoTalkService.memoTalkList[index];
    return (
      <CellMeasurer
        cache={cacheRef.current}
        columnIndex={0}
        key={key}
        rowIndex={index}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parent={parent as any}
      >
        {({ registerChild }) => (
          <div ref={registerChild as any} style={style} id={memoTalk.id}>
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
        )}
      </CellMeasurer>
    );
  };

  const cache = cacheRef.current;
  return (
    <div ref={container} className={styles.messages}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={(ref) => {
              listRef.current = ref;
            }}
            width={width}
            height={height}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            rowCount={memoTalkService.memoTalkList.length}
            overscanRowCount={3}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export { MemoTalkContainer };
