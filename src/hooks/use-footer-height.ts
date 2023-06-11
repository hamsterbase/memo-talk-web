import { useEffect, useRef, useState } from 'react';

export const useFooterHeight = (innerHeight: number) => {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!footerRef.current) {
      return;
    }
    const footerElement = footerRef.current;
    new ResizeObserver(() => {
      const rect = footerElement.getBoundingClientRect();
      setFooterHeight(innerHeight - rect.top);
    }).observe(footerElement);
  }, [innerHeight]);

  return {
    footerRef,
    footerHeight,
  };
};
