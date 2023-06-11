import { IMemoTalkCore, MemoTalk } from '@/core/memo-talk-core';
import { DatabaseKey, ISettingService } from '@/core/storage';
import { Emitter, Event } from '@/vscf/base/common/event';
import { createDecorator } from '@/vscf/platform/instantiation/common';

export type MemoTalStatus =
  | {
      type: 'create';
      id: string;
    }
  | {
      type: 'delete';
      id: string;
    }
  | {
      type: 'init';
    };

export interface IMemoTalkService {
  memoTalkList: MemoTalk[];
  init(): Promise<void>;
  createMemoTalk(content: string): void;
  deleteMemoTalk(memoTalkId: string): void;
  onStatusChange: Event<MemoTalStatus>;
}

export const IMemoTalkService =
  createDecorator<IMemoTalkService>('IMemoTalkService');

export class MemoTalkService implements IMemoTalkService {
  private _onStatusChange = new Emitter<MemoTalStatus>();
  public readonly onStatusChange = this._onStatusChange.event;

  get memoTalkList(): MemoTalk[] {
    return this._memoTalkList;
  }

  private _memoTalkList: MemoTalk[] = [];

  constructor(
    @IMemoTalkCore private memoTalkCore: IMemoTalkCore,
    @ISettingService private settingService: ISettingService
  ) {}

  async init() {
    const initValue = await this.settingService.get(DatabaseKey, '');
    if (initValue) {
      this.memoTalkCore.merge(initValue);
    }
    this.refreshStatus({
      type: 'init',
    });
    this.memoTalkCore.onUpdate(() => {
      this.settingService.set(DatabaseKey, this.memoTalkCore.encode());
      this.refreshStatus({
        type: 'init',
      });
    });
  }

  async createMemoTalk(memoTalkContent: string) {
    const id = this.memoTalkCore.createMemoTalk(memoTalkContent);
    this.refreshStatus({
      type: 'create',
      id,
    });
  }

  async deleteMemoTalk(memoTalkId: string) {
    this.memoTalkCore.deleteMemoTalkById(memoTalkId);
    this.refreshStatus({
      type: 'delete',
      id: memoTalkId,
    });
  }

  private refreshStatus(status: MemoTalStatus) {
    this._memoTalkList = this.memoTalkCore.getMemoTalkList();
    this._onStatusChange.fire(status);
  }
}
