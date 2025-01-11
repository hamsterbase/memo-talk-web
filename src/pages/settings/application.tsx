import { License } from '@/components/license';
import { MemoTalkCore } from '@/core/memo-talk-core';
import { useService } from '@/hooks/use-service';
import { useSettingService } from '@/hooks/use-setting-service';
import { Data, DatabaseSync, Empty } from '@icon-park/react';
import {
  ActionSheet,
  Dialog,
  List,
  NavBar,
  Space,
  Switch,
  Toast,
} from 'antd-mobile';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React from 'react';
import uuidApiKey from 'uuid-apikey';
import { DatabaseKey, ISettingService, StorageKeys } from '../../core/storage';

const uploadFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';

  return new Promise<string | null>((resolve, reject) => {
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (!file) {
        resolve(null);
      } else {
        readFileAsString(file).then(resolve).catch(reject);
      }
    });
    input.addEventListener('cancel', () => {
      resolve(null);
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};

const readFileAsString = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as unknown as string;
      resolve(content);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsText(file);
  });
};

export const App: React.FC = () => {
  const appSetting = useSettingService();
  const settingService = useService(ISettingService);

  if (!appSetting.init) {
    return null;
  }

  const cloudSyncEnable = !!appSetting.setting.securityToken;

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
          prefix={<Empty />}
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
          prefix={<Data />}
          onClick={async () => {
            const databaseValue = await settingService.get(DatabaseKey, '');
            const backup = (name: string) => {
              const blob = new Blob([databaseValue]);
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = name;
              a.click();
              URL.revokeObjectURL(url);
            };

            ActionSheet.show({
              closeOnAction: true,
              closeOnMaskClick: true,
              actions: [
                {
                  key: 'export',
                  disabled: !databaseValue,
                  description: !databaseValue ? '数据库为空' : '',
                  text: '导出备份',
                  onClick: async () => {
                    await backup(
                      `${dayjs().format(
                        'YYYY-MM-DD HH:mm:ss 手动备份'
                      )}.memoTalk`
                    );
                  },
                },
                {
                  key: 'import',
                  text: '导入备份',
                  description: '导入备份, 和当前数据库合并。',
                  onClick: async () => {
                    const userSelectFile: string | null = await uploadFile();
                    if (!userSelectFile) {
                      return;
                    }
                    await settingService.set(
                      DatabaseKey,
                      MemoTalkCore.merge(databaseValue, userSelectFile)
                    );
                    Toast.show({
                      content: '导入成功',
                    });
                  },
                },
                {
                  key: 'replace',
                  text: '替换数据库',
                  description: '导入备份，替换当前数据库',
                  onClick: async () => {
                    const userSelectFile: string | null = await uploadFile();
                    if (!userSelectFile) {
                      return;
                    }
                    await settingService.set(DatabaseKey, userSelectFile);
                    Toast.show({
                      content: '替换成功',
                    });
                  },
                },
                {
                  text: '删除数据库',
                  key: 'delete',
                  description: cloudSyncEnable?'云同步开启时无法删除数据库':'删除后数据不可恢复',
                  danger: true,
                  disabled:cloudSyncEnable,
                  bold: true,
                  onClick: async () => {
                    await settingService.set(DatabaseKey, '');
                    Toast.show({
                      content: '删除成功',
                    });
                  },
                },
              ],
            });
          }}
        >
          数据管理
        </List.Item>
        <List.Item
          prefix={<DatabaseSync />}
          extra={
            <Switch
              checked={!!appSetting.setting.securityToken}
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
                                StorageKeys.securityToken,
                                currentToken
                              );
                            }
                          },
                        },
                      ],
                    ],
                  });
                } else {
                  await appSetting.update(StorageKeys.securityToken, '');
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
                      content: appSetting.setting.securityToken,
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
      </List>
    </div>
  );
};
