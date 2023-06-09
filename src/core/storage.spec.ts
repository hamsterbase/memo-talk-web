import { indexedDB } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ISettingService,
  IndexedDBSettingService,
  SettingsValue,
} from './storage';

class FakeIndexedDBSettingService extends IndexedDBSettingService {
  protected getIndexedDB(): IDBFactory {
    return indexedDB;
  }
}

function createSettingService(): ISettingService {
  // 返回一个新的 IndexedDBSettingService 实例
  return new FakeIndexedDBSettingService();
}

describe('ISettingService', () => {
  let service: ISettingService;

  beforeEach(() => {
    // 在每个测试用例之前创建一个新的 ISettingService 实例
    service = createSettingService();
  });

  afterEach(async () => {
    // 在每个测试用例之后清除所有设置
    await service.clearAll();
  });

  describe('get', () => {
    it('should return default value when key does not exist', async () => {
      const defaultValue = 'default value';
      const value = await service.get('non-existent key', defaultValue);
      expect(value).toEqual(defaultValue);
    });

    it('should return stored value when key exists', async () => {
      const key = 'stored key';
      const value: SettingsValue = true;
      await service.set(key, value);
      const retrievedValue = await service.get(key, false);
      expect(retrievedValue).toEqual(value);
    });

    it('should return boolean value when requested', async () => {
      const key = 'boolean key';
      const value: SettingsValue = true;
      await service.set(key, value);
      const retrievedValue = await service.get<boolean>(key, false);
      expect(retrievedValue).toEqual(value);
    });

    it('should return string value when requested', async () => {
      const key = 'string key';
      const value: SettingsValue = 'my string value';
      await service.set(key, value);
      const retrievedValue = await service.get<string>(key, '');
      expect(retrievedValue).toEqual(value);
    });
  });

  describe('set', () => {
    it('should store boolean value', async () => {
      const key = 'boolean key';
      const value: SettingsValue = true;
      await service.set(key, value);
      const retrievedValue = await service.get<boolean>(key, false);
      expect(retrievedValue).toEqual(value);
    });

    it('should store string value', async () => {
      const key = 'string key';
      const value: SettingsValue = 'my string value';
      await service.set(key, value);
      const retrievedValue = await service.get<string>(key, '');
      expect(retrievedValue).toEqual(value);
    });
  });

  describe('readConfig', () => {
    it('should return default values when no settings are stored', async () => {
      const defaultValue = {
        booleanKey: false,
        stringKey: 'default string value',
      };
      const config = await service.readConfig(defaultValue);
      expect(config).to.deep.equal(defaultValue);
    });

    it('should return stored values when settings are stored', async () => {
      const storedValue = {
        booleanKey: true,
        stringKey: 'stored string value',
      };
      await service.set('booleanKey', storedValue.booleanKey);
      await service.set('stringKey', storedValue.stringKey);

      const defaultValue = {
        booleanKey: false,
        stringKey: 'default string value',
      };
      const config = await service.readConfig(defaultValue);
      expect(config).to.deep.equal(storedValue);
    });

    it('should return default values for missing keys', async () => {
      const storedValue = {
        booleanKey: true,
      };
      await service.set('booleanKey', storedValue.booleanKey);

      const defaultValue = {
        booleanKey: false,
        stringKey: 'default string value',
      };
      const config = await service.readConfig(defaultValue);
      expect(config).to.deep.equal({
        ...storedValue,
        stringKey: defaultValue.stringKey,
      });
    });
  });
});
