export type SettingsValue = string | boolean;

export const DatabaseKey = 'hamsterDatabase';

export enum StorageKeys {
  'hamsterbaseURL' = 'hamsterbaseURL',
  'hamsterUsername' = 'hamsterUsername',
  'hamsterPassword' = 'hamsterPassword',
  'dominantHand' = 'dominantHand',
}

export const defaultSettingValue = {
  [StorageKeys.hamsterbaseURL]: 'https://memo-talk.onrender.com',
  [StorageKeys.hamsterUsername]: '',
  [StorageKeys.hamsterPassword]: '',
  [StorageKeys.dominantHand]: 'right',
};

export type SettingType = typeof defaultSettingValue;

export interface ISettingService {
  get<V extends SettingsValue>(key: string, defaultValue: V): Promise<V>;

  set(key: string, value: SettingsValue): Promise<void>;

  readConfig<T extends Record<string, SettingsValue>>(
    defaultValue: T
  ): Promise<T>;

  clearAll(): Promise<void>;
}
export interface ConfigDatabase {
  settings: Record<string, SettingsValue>;
}

export class IndexedDBSettingService implements ISettingService {
  private readonly dbName: string = 'my-settings-db';
  private readonly dbVersion: number = 1;
  private readonly storeName: string = 'settings';

  private async openDB(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = this.getIndexedDB().open(this.dbName, this.dbVersion);
      request.onerror = (event) => {
        console.error('Error opening database', event);
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  public async get<V extends SettingsValue>(
    key: string,
    defaultValue: V
  ): Promise<V> {
    const db = await this.openDB();
    return new Promise<V>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.get(key);

      request.onerror = (event) => {
        console.error(`Error getting value for key "${key}"`, event);
        reject(event);
      };

      request.onsuccess = () => {
        const value =
          request.result !== undefined ? request.result : defaultValue;
        resolve(value);
      };
    });
  }

  public async set(key: string, value: SettingsValue): Promise<void> {
    const db = await this.openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.put(value, key);

      request.onerror = (event) => {
        console.error(`Error setting value for key "${key}"`, event);
        reject(event);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  }

  public async readConfig<T extends Record<string, SettingsValue>>(
    defaultValue: T
  ): Promise<T> {
    const result = await Promise.all(
      Object.keys(defaultValue).map(async (key: string) => {
        return {
          [key]: await this.get(key, defaultValue[key]),
        };
      })
    );
    return Object.assign({}, ...result);
  }

  public async clearAll(): Promise<void> {
    const db = await this.openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.clear();

      request.onerror = () => {
        console.error('Error clearing settings', event);
        reject(event);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  protected getIndexedDB() {
    return indexedDB;
  }
}
