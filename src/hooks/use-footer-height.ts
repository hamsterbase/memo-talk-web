import { useLayoutEffect, useRef, useState } from 'react';

export const useFooterHeight = () => {
  const [footerHeight, setFooterHeight] = useState(0);

  const [innerHeight, setInnerHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      if (!footerRef.current) {
        return;
      }
      const footerElement = footerRef.current;
      const rect = footerElement.getBoundingClientRect();
      setFooterHeight(window.innerHeight - rect.top);
      setInnerHeight(window.innerHeight);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return {
    footerRef,
    footerHeight,
    innerHeight,
  };
};
