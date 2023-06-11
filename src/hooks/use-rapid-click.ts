import { useCallback, useEffect, useState } from 'react';

export const useRapidClick = (handler: () => void) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = useCallback(() => {
    const currentTime = Date.now();
    const timeInterval = currentTime - lastClickTime;

    if (timeInterval <= 500) {
      setClickCount(clickCount + 1);
    } else {
      setClickCount(1);
    }

    setLastClickTime(currentTime);
  }, [clickCount, lastClickTime]);

  useEffect(() => {
    if (clickCount === 3) {
      handler();
      setClickCount(0);
    }
  }, [clickCount, handler]);

  return handleClick;
};
