import {
  ISettingService,
  SettingType,
  SettingsValue,
  defaultSettingValue,
  StorageKeys,
} from '@/core/storage';
import { useEffect, useState } from 'react';
import { useService } from './use-service';

export const useSettingService = () => {
  const settingService = useService(ISettingService);

  const [setting, setSettings] = useState<SettingType | null>(null);
  useEffect(() => {
    settingService.readConfig(defaultSettingValue).then((res) => {
      setSettings(res);
    });
  }, [settingService]);

  const update = async (key: string, value: SettingsValue) => {
    await settingService.set(key, value);
    const newValue = await settingService.readConfig(defaultSettingValue);
    setSettings(newValue);
  };

  return {
    init: !!setting,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setting: setting!,
    update,
    StorageKeys,
  };
};
