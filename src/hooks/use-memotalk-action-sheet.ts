import { IMemoTalkService } from '@/services/note/node-service';
import { useService } from './use-service';
import { useEventRender } from './use-event-render';
import { useMemo, useState } from 'react';
import { MemoTalk } from '@/core/memo-talk-core';

export const useMemotalkActionSheet = (edit: (memo: MemoTalk) => void) => {
  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);
  const [memoId, setMemoId] = useState<string | null>(null);
  const actions = useMemo(() => {
    if (!memoId) return [];
    return [
      {
        text: '编辑',
        key: 'edit',
        onClick: () => {
          const meno = memoTalkService.getMemoTalk(memoId);
          setMemoId(null);
          if (meno) {
            edit(meno);
          }
        },
      },
      {
        text: '删除',
        key: 'delete',
        danger: true,
        onClick: () => {
          try {
            memoTalkService.deleteMemoTalk(memoId);
          } catch (error) {
            console.log('error');
          }
          setMemoId(null);
        },
      },
    ];
  }, [memoTalkService, memoId, edit]);

  return {
    props: {
      actions,
      visible: !!memoId,
      onClose: () => setMemoId(null),
    },
    selectMemo: setMemoId,
  };
};
