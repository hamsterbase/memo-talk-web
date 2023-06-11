import {
  FooterComponent,
  useFooterComponent,
} from '@/components/footer/footer.tsx';
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
import { ActionSheet, NavBar, ProgressCircle, SafeArea } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React from 'react';
import { MemoTalkContainer } from '../../memo-talk.tsx';
import styles from './application.module.css';
import './main.tsx';

export const App: React.FC = () => {
  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);

  const footerComponentValue = useFooterComponent();

  const memotalkActionSheet = useMemotalkActionSheet((memo) => {
    footerComponentValue?.edit(memo);
  });

  const cloudSyncService = useService(ICloudSyncService);
  useEventRender(cloudSyncService.onStatusChange);

  const appSetting = useSettingService();

  const { innerHeight } = useInnerHight();
  const { footerHeight, footerRef } = useFooterHeight(innerHeight);
  const contentHeight = innerHeight - 45 - footerHeight;

  const handleGoSetting = () => {
    window.location.href = '/settings/index.html';
  };

  if (!appSetting.init) {
    return null;
  }

  return (
    <div>
      <NavBar
        back={null}
        right={
          <MoreOutline style={{ fontSize: 24 }} onClick={handleGoSetting} />
        }
      >
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
          onClick={memotalkActionSheet.selectMemo}
        />
      </div>
      <div style={{ height: footerHeight, width: '100%' }}></div>
      <div ref={footerRef} className={styles.footer}>
        {footerComponentValue && (
          <FooterComponent {...footerComponentValue?.props}></FooterComponent>
        )}
        <SafeArea position="bottom"></SafeArea>
      </div>
    </div>
  );
};
