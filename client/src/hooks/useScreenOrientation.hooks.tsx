import { useEffect, useState } from 'react';

type Orientation = 'portrait' | 'landscape';

const getOrientation = (): Orientation => {
  return window.screen.orientation.type.includes('portrait')
    ? 'portrait'
    : 'landscape';
};

export const useScreenOrientation = (): Orientation => {
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

  return orientation;
};
