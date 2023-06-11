import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useFooterHeight = (innerHeight: number) => {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count + 1);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useLayoutEffect(() => {
    if (!footerRef.current) {
      return;
    }
    const footerElement = footerRef.current;
    const rect = footerElement.getBoundingClientRect();
    setFooterHeight(innerHeight - rect.top);
  }, [innerHeight, count]);

  return {
    footerRef,
    footerHeight,
  };
};
