import { useState, useEffect } from 'react';

interface Orientation {
  angle: number;
  type: string;
}

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>({
    angle: window.screen.orientation?.angle || 0,
    type: window.screen.orientation?.type || 'landscape-primary',
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation({
        angle: window.screen.orientation?.angle || 0,
        type: window.screen.orientation?.type || 'landscape-primary',
      });
    };

    window.screen.orientation?.addEventListener('change', handleOrientationChange);
    return () => {
      window.screen.orientation?.removeEventListener(
        'change',
        handleOrientationChange
      );
    };
  }, []);

  return orientation;
}; 