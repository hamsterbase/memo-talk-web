import { License } from '@/components/license';
import { useSettingService } from '@/hooks/use-setting-service';
import { DatabaseSync } from '@icon-park/react';
import { Dialog, List, NavBar, Space, Switch, Toast } from 'antd-mobile';
import { nanoid } from 'nanoid';
import React from 'react';
import uuidApiKey from 'uuid-apikey';
import { StorageKeys } from '../../core/storage';

export const App: React.FC = () => {
  const appSetting = useSettingService();

  if (!appSetting.init) {
    return null;
  }

  const cloudSyncEnable = !!appSetting.setting.syncToken;

  return (
    <div>
      <NavBar
        onBack={() => {
          window.location.href = '/';
        }}
      >
        设置
      </NavBar>
      <Space />
      <List mode="card">
        <List.Item
          prefix={<DatabaseSync />}
          extra={appSetting.setting.dominantHand === 'right' ? '右手' : '左手'}
          clickable
          onClick={async () => {
            appSetting.update(
              StorageKeys.dominantHand,
              appSetting.setting.dominantHand === 'right' ? 'left' : 'right'
            );
          }}
        >
          惯用手
        </List.Item>
        <List.Item
          prefix={<DatabaseSync />}
          extra={
            <Switch
              checked={!!appSetting.setting.syncToken}
              onChange={async (checked) => {
                if (checked) {
                  const randomId = nanoid();
                  const handler = Dialog.show({
                    closeOnMaskClick: true,
                    title: '用户协议',
                    content: <License randomId={randomId}></License>,
                    actions: [
                      [
                        {
                          key: 'cancel',
                          text: '取消',
                          onClick: async () => {
                            handler.close();
                          },
                        },
                        {
                          key: 'open',
                          text: '确认开启',
                          bold: true,
                          onClick: async () => {
                            const currentToken = (
                              document.getElementById(
                                randomId
                              ) as HTMLInputElement
                            ).value;

                            if (!uuidApiKey.isAPIKey(currentToken)) {
                              Toast.show({
                                content: '密码格式不正确。',
                              });
                            } else {
                              handler.close();
                              await appSetting.update(
                                StorageKeys.syncToken,
                                currentToken
                              );
                            }
                          },
                        },
                      ],
                    ],
                  });
                } else {
                  await appSetting.update(StorageKeys.syncToken, '');
                }
              }}
            />
          }
          description={
            cloudSyncEnable ? (
              <p style={{ display: 'inline-block', margin: 0 }}>
                云同步已开启{' '}
                <a
                  onClick={() => {
                    Dialog.alert({
                      content: appSetting.setting.syncToken,
                    });
                  }}
                >
                  查看同步密码
                </a>
              </p>
            ) : (
              '云同步未开启'
            )
          }
        >
          云同步
        </List.Item>
        <List.Item></List.Item>
      </List>
    </div>
  );
};
