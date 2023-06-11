import MoreOne from '@icon-park/react/es/icons/MoreOne';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { Markdown } from './components/markdown/markdown';
import { useEventRender } from './hooks/use-event-render';
import { useService } from './hooks/use-service';
import styles from './mem-talk.module.css';
import { IMemoTalkService } from './services/note/node-service';

import {
  List,
  AutoSizer,
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized';

interface MemoTalk {
  id: string;
  content: string;
  createTime: number;
}

interface Props {
  memoTalks: MemoTalk[];
  dominantHand: string;
  onClick(id: string): void;
}

const MemoTalkContainer: React.FC<Props> = ({
  memoTalks,
  onClick,
  dominantHand,
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      keyMapper: (index) => memoTalks[index].id,
    })
  );

  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);

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
    const memoTalk = memoTalks[index];
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
            width={width}
            height={height}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            rowCount={memoTalks.length}
            overscanRowCount={3}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export { MemoTalkContainer };
