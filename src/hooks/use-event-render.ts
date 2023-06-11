import { useLayoutEffect } from 'react';
import { useRender } from './use-render';
import { Event } from 'vscf/base/common/event';

export function useEventRender(event: Event<unknown> | undefined) {
  const render = useRender();
  useLayoutEffect(() => {
    if (event) {
      return event(render).dispose;
    }
  }, [event, render]);
}
