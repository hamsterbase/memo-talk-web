import { Button, Form, Input, List, NavBar, Popup, Space } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import {
  ISettingService,
  SettingType,
  StorageKeys,
  defaultSettingValue,
} from '../../core/storage';
import { DatabaseSync } from '@icon-park/react';

const CloudSync: React.FC<{
  visible: boolean;
  setVisible: (value: boolean) => void;
  setting: SettingType;
  onSave: (url: {
    url: string;
    name: string;
    password: string;
  }) => Promise<void>;
}> = (props) => {
  const [form] = Form.useForm();
  const onSubmit = async () => {
    const values = form.getFieldsValue();
    await props.onSave(values);
    props.setVisible(false);
  };
  return (
    <Popup
      visible={props.visible}
      onMaskClick={() => {
        props.setVisible(false);
      }}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        minHeight: '40vh',
      }}
    >
      <Form
        form={form}
        initialValues={{
          url: props.setting.hamsterbaseURL,
          name: props.setting.hamsterUsername,
          password: props.setting.hamsterPassword,
        }}
        mode="card"
        footer={
          <Button block color="primary" onClick={onSubmit} size="large">
            保存
          </Button>
        }
      >
        <Form.Item
          name="url"
          label="服务器地址"
          rules={[{ required: true, message: '服务器地址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="账户"
          rules={[{ required: true, message: '账户' }]}
        >
          <Input placeholder="请输入账户" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '密码' }]}
        >
          <Input placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Popup>
  );
};

export const App: React.FC<{
  settingService: ISettingService;
}> = (props) => {
  const [visible, setVisible] = useState(false);
  const [setting, setSettings] = useState<SettingType | null>(null);

  useEffect(() => {
    props.settingService.readConfig(defaultSettingValue).then((res) => {
      setSettings(res);
    });
  }, [props.settingService]);

  const isEnable =
    setting &&
    setting[StorageKeys.hamsterbaseURL] &&
    setting[StorageKeys.hamsterUsername] &&
    setting[StorageKeys.hamsterPassword];

  if (!setting) {
    return null;
  }

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
          extra={setting.dominantHand === 'right' ? '右手' : '左手'}
          clickable
          onClick={async () => {
            const newSetting: SettingType = {
              ...setting,
              [StorageKeys.dominantHand]:
                setting.dominantHand === 'right' ? 'left' : 'right',
            };
            await props.settingService.set(
              StorageKeys.dominantHand,
              setting.dominantHand === 'right' ? 'left' : 'right'
            );
            setSettings(newSetting);
          }}
        >
          惯用手
        </List.Item>
      </List>
      <List mode="card">
        <List.Item
          prefix={<DatabaseSync />}
          extra={isEnable ? '已开启' : '未开启'}
          clickable
          onClick={() => setVisible(true)}
        >
          云同步
        </List.Item>
      </List>
      <CloudSync
        setting={setting}
        visible={visible}
        setVisible={setVisible}
        onSave={async (value) => {
          const newSetting: SettingType = {
            ...setting,
            [StorageKeys.hamsterbaseURL]: value.url,
            [StorageKeys.hamsterPassword]: value.password,
            [StorageKeys.hamsterUsername]: value.name,
          };
          setSettings(newSetting);
          await props.settingService.set(
            StorageKeys.hamsterbaseURL,
            newSetting['hamsterbaseURL']
          );
          await props.settingService.set(
            StorageKeys.hamsterUsername,
            value.name
          );
          await props.settingService.set(
            StorageKeys.hamsterPassword,
            value.password
          );
        }}
      />
    </div>
  );
};
