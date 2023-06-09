import {
  FooterComponent,
  useFooterComponent,
} from '@/components/footer/footer.tsx';
import { useEventRender } from '@/hooks/use-event-render.ts';
import { useFooterHeight } from '@/hooks/use-footer-height.ts';
import { useMemotalkActionSheet } from '@/hooks/use-memotalk-action-sheet.ts';
import { useService } from '@/hooks/use-service.ts';
import { useSettingService } from '@/hooks/use-setting-service.ts';
import { MemoTalkContainerNative } from '@/memo-talk-native.tsx';
import { IMemoTalkService } from '@/services/note/node-service.ts';
import {
  ICloudSyncService,
  SyncStatus,
  getProcessStatus,
} from '@/services/sync/cloud-sync-service.ts';
import { ActionSheet, NavBar, ProgressCircle, SafeArea } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import React, { useCallback } from 'react';
import styles from './application.module.css';
import './main.tsx';

export const App: React.FC = () => {
  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);

  const appSetting = useSettingService();

  const toggleDominantHand = useCallback(() => {
    appSetting.update(
      appSetting.StorageKeys.dominantHand,
      appSetting.setting.dominantHand === 'right' ? 'left' : 'right'
    );
  }, [appSetting]);

  const footerComponentValue = useFooterComponent(toggleDominantHand);

  const memotalkActionSheet = useMemotalkActionSheet((memo) => {
    footerComponentValue?.edit(memo);
  });

  const cloudSyncService = useService(ICloudSyncService);
  useEventRender(cloudSyncService.onStatusChange);

  const { footerHeight, footerRef, innerHeight } = useFooterHeight();
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
        <MemoTalkContainerNative
          dominantHand={appSetting.setting.dominantHand}
          onClick={memotalkActionSheet.selectMemo}
        />
      </div>
      <div ref={footerRef} className={styles.footer}>
        {footerComponentValue && (
          <FooterComponent
            {...footerComponentValue?.props}
            dominantHand={appSetting.setting.dominantHand}
          ></FooterComponent>
        )}
        <SafeArea position="bottom"></SafeArea>
      </div>
    </div>
  );
};
