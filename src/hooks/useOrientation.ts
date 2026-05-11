import { useEffect, useState } from 'react';

function useOrientation(): boolean {
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(orientation: portrait)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(orientation: portrait)');

    function handleChange(e: MediaQueryListEvent) {
      setIsPortrait(e.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isPortrait;
}

export { useOrientation };
