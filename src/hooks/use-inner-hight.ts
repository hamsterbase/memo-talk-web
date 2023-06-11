import { useEffect, useState } from 'react';

export const useInnerHight = () => {
  const [innerHeight, setHeight] = useState<number>(window.innerHeight);
  useEffect(() => {
    const onViewportResize = () => {
      const viewportHeight = window.innerHeight;
      setHeight(viewportHeight);
    };

    window.addEventListener('resize', onViewportResize);
    return () => window.removeEventListener('reset', onViewportResize);
  });
  return { innerHeight };
};
