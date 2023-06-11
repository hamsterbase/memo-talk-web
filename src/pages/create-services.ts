import { IMemoTalkCore, MemoTalkCore } from '@/core/memo-talk-core';
import { ISettingService, IndexedDBSettingService } from '@/core/storage';
import {
  IMemoTalkService,
  MemoTalkService,
} from '@/services/note/node-service';
import {
  InstantiationService,
  ServiceCollection,
  SyncDescriptor,
} from '@/vscf/platform/instantiation/common';
import {
  CloudSyncService,
  ICloudSyncService,
} from './../services/sync/cloud-sync-service';

export function initServices() {
  const serviceCollection = new ServiceCollection();
  serviceCollection.set(
    ISettingService,
    new SyncDescriptor(IndexedDBSettingService)
  );
  serviceCollection.set(IMemoTalkCore, new SyncDescriptor(MemoTalkCore));
  serviceCollection.set(
    ICloudSyncService,
    new SyncDescriptor(CloudSyncService)
  );
  serviceCollection.set(
    ICloudSyncService,
    new SyncDescriptor(CloudSyncService)
  );
  serviceCollection.set(IMemoTalkService, new SyncDescriptor(MemoTalkService));
  const instantiationService = new InstantiationService(
    serviceCollection,
    true
  );
  return instantiationService;
}
