import { MemoTalk } from '@/core/memo-talk-core';
import { useRapidClick } from '@/hooks/use-rapid-click';
import { useService } from '@/hooks/use-service';
import { useSettingService } from '@/hooks/use-setting-service';
import { IMemoTalkService } from '@/services/note/node-service';
import { ICloudSyncService } from '@/services/sync/cloud-sync-service';
import { Button, Space, TextArea } from 'antd-mobile';
import { useState } from 'react';

type Mode =
  | {
      type: 'create';
      value: string;
    }
  | {
      type: 'edit';
      id: string;
      value: string;
    };

interface FooterComponentProps {
  mode: Mode;
  value: string;
  onChange: (v: string) => void;
  onSave(): Promise<void>;
  onCancel(): void;
  dominantHand: string;
  handleClickEmptyArea: () => void;
}

export const useFooterComponent = (toggleDominantHand: () => void) => {
  const [mode, setMode] = useState<Mode>({ type: 'create', value: '' });
  const memoTalkService = useService(IMemoTalkService);

  const cloudSyncService = useService(ICloudSyncService);

  const appSetting = useSettingService();

  const handleClickEmptyArea = useRapidClick(() => {
    toggleDominantHand();
  });

  if (!appSetting.init) {
    return null;
  }

  const props: FooterComponentProps = {
    mode,
    value: mode.value,
    dominantHand: appSetting.setting.dominantHand,
    onChange: (v) => setMode((m) => ({ ...m, value: v })),
    onSave: async () => {
      switch (mode.type) {
        case 'create': {
          await memoTalkService.createMemoTalk(mode.value);
          setMode({ type: 'create', value: '' });
          break;
        }
        case 'edit': {
          await memoTalkService.updateMemoTalk(mode.id, mode.value);
          setMode({ type: 'create', value: '' });
          break;
        }
      }
      cloudSyncService.sync();
    },
    onCancel: () => {
      setMode({ type: 'create', value: '' });
    },
    handleClickEmptyArea: handleClickEmptyArea,
  };

  return {
    props,

    edit: (memo: MemoTalk) => {
      setMode({ type: 'edit', id: memo.id, value: memo.content });
    },
  };
};

export const FooterComponent: React.FC<FooterComponentProps> = (props) => {
  return (
    <div
      style={{
        borderRadius: 8,
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        background: 'white',
        flexDirection: 'column',
        padding: 8,
      }}
    >
      <TextArea
        placeholder="随便说一点"
        rows={2}
        autoSize={{
          minRows: 2,
          maxRows: 10,
        }}
        value={props.value}
        onChange={props.onChange}
      />
      <div
        style={{
          flexShrink: 0,
          position: 'relative',
          background: 'white',
          marginTop: 8,
          display: 'flex',
          justifyContent:
            props.dominantHand === 'right' ? 'flex-end' : 'flex-start',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            props.handleClickEmptyArea();
          }
        }}
      >
        {props.mode.type === 'edit' && (
          <Button
            size="small"
            onClick={props.onCancel}
            style={{ margin: '0 4px' }}
          >
            取消
          </Button>
        )}
        <Button
          disabled={!props.value}
          color="primary"
          size="small"
          onClick={props.onSave}
        >
          {props.mode.type === 'edit' && '保存'}
          {props.mode.type === 'create' && '发送'}
        </Button>
      </div>
    </div>
  );
};
