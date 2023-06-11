import { IMemoTalkService } from '@/services/note/node-service';
import { useService } from './use-service';
import { useEventRender } from './use-event-render';
import { useMemo, useState } from 'react';

export const useMemotalkActionSheet = () => {
  const memoTalkService = useService(IMemoTalkService);
  useEventRender(memoTalkService.onStatusChange);
  const [memoId, setMemoId] = useState<string | null>(null);
  const actions = useMemo(() => {
    if (!memoId) return [];
    return [
      {
        text: '删除',
        key: 'delete',
        danger: true,
        bold: true,
        onClick: () => {
          memoTalkService.deleteMemoTalk(memoId);
          setMemoId(null);
        },
      },
    ];
  }, [memoTalkService, memoId]);

  return {
    props: {
      actions,
      visible: !!memoId,
      onClose: () => setMemoId(null),
    },
    selectMemo: setMemoId,
  };
};
