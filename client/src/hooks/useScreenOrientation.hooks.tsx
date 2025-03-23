import { useEffect, useState } from 'react';

type Orientation = 'portrait' | 'landscape';

const getOrientation = (): Orientation => {
  return window.screen.orientation.type.includes('portrait')
    ? 'portrait'
    : 'landscape';
};

type UseScreenOrientationReturnType = {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
};

export const useScreenOrientation = (): UseScreenOrientationReturnType => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = () => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return {
    orientation,
    isPortrait: window.screen.orientation.type.includes('portrait'),
    isLandscape: window.screen.orientation.type.includes('landscape'),
  };
};
