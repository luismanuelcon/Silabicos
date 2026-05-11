import { useEffect, useRef } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { loadProfile } from '../../services/storageService';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { dispatch: navDispatch } = useNavigation();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Check localStorage directly — PlayerProvider may not have hydrated yet
    const profile = loadProfile();
    if (profile) {
      navDispatch({ type: 'NAVIGATE_TO', payload: 'welcome' });
    }
    // Otherwise, stay on avatar-select (default)
  }, [navDispatch]);

  return <>{children}</>;
}

export { AppInitializer };
