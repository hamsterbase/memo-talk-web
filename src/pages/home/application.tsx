import { useEventRender } from '@/hooks/use-event-render.ts';
import { useFooterHeight } from '@/hooks/use-footer-height.ts';
import { useInnerHight } from '@/hooks/use-inner-hight.ts';
import { useMemotalkActionSheet } from '@/hooks/use-memotalk-action-sheet.ts';
import { useService } from '@/hooks/use-service.ts';
import { useSettingService } from '@/hooks/use-setting-service.ts';
import { IMemoTalkService } from '@/services/note/node-service.ts';
import {
  ICloudSyncService,
  SyncStatus,
  getProcessStatus,
} from '@/services/sync/cloud-sync-service.ts';
import {
  ActionSheet,
  Button,
  NavBar,
  ProgressCircle,
  SafeArea,
  TextArea,
} from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { MemoTalkContainer } from '../../memo-talk.tsx';
import styles from './application.module.css';
import './main.tsx';

const useRapidClick = (handler: () => void) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = useCallback(() => {
    const currentTime = Date.now();
    const timeInterval = currentTime - lastClickTime;

    if (timeInterval <= 500) {
      setClickCount(clickCount + 1);
    } else {
      setClickCount(1);
    }

    setLastClickTime(currentTime);
  }, [clickCount, lastClickTime]);

  useEffect(() => {
    if (clickCount === 3) {
      handler();
      setClickCount(0);
    }
  }, [clickCount, handler]);

  return handleClick;
};

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);
  const memotalkActionSheet = useMemotalkActionSheet();

  const cloudSyncService = useService(ICloudSyncService);
  useEventRender(cloudSyncService.onStatusChange);

  const appSetting = useSettingService();

  const { innerHeight } = useInnerHight();
  const { footerHeight, footerRef } = useFooterHeight(innerHeight);
  const contentHeight = innerHeight - 45 - footerHeight;

  const handleClick = useRapidClick(() => {
    appSetting.update(
      appSetting.StorageKeys.dominantHand,
      appSetting.setting.dominantHand === 'right' ? 'left' : 'right'
    );
  });

  const handleGoSetting = () => {
    window.location.href = '/settings/index.html';
  };

  if (!appSetting.init) {
    return null;
  }

  return (
    <div>
      <NavBar back={null} right={<MoreOutline onClick={handleGoSetting} />}>
        <span
          style={{ position: 'relative' }}
          onClick={() => cloudSyncService.sync()}
        >
          {cloudSyncService.status !== SyncStatus.Default && (
            <ProgressCircle
              style={{
                '--size': '16px',
                position: 'absolute',
                top: 2,
                left: 0,
                transform: 'translate(-20px)',
              }}
              percent={getProcessStatus(cloudSyncService.status)}
            />
          )}
          Memotalk
        </span>
      </NavBar>
      <ActionSheet {...memotalkActionSheet.props} />

      <div
        style={{
          height: contentHeight,
        }}
      >
        <MemoTalkContainer
          dominantHand={appSetting.setting.dominantHand}
          memoTalks={memoTalkService.memoTalkList}
          onClick={memotalkActionSheet.selectMemo}
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
            autoSize={{
              minRows: 2,
              maxRows: 10,
            }}
            value={inputValue}
            onChange={(v) => {
              setInputValue(v);
            }}
          />
          <div
            style={{
              flexShrink: 0,
              position: 'relative',
              background: 'white',
              marginTop: 8,
              display: 'flex',
              justifyContent:
                appSetting.setting.dominantHand === 'right'
                  ? 'flex-end'
                  : 'flex-start',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClick();
              }
            }}
          >
            <Button
              disabled={!inputValue.trim()}
              color="primary"
              size="small"
              onClick={() => {
                memoTalkService.createMemoTalk(inputValue);
                cloudSyncService.sync();
                setInputValue('');
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

// 1. 用户需要点 5 下
// 2. 间隔不能超过 500ms
