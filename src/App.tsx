import { PlayerProvider } from './contexts/PlayerContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DictionaryProvider } from './contexts/DictionaryContext';
import { GameProvider } from './contexts/GameContext';
import { ScreenManager } from './components/ScreenManager/ScreenManager';
import { OrientationOverlay } from './components/OrientationOverlay/OrientationOverlay';
import { HomeButton } from './components/HomeButton/HomeButton';
import { AppInitializer } from './components/AppInitializer/AppInitializer';

function App() {
  return (
    <DictionaryProvider>
      <PlayerProvider>
        <GameProvider>
          <NavigationProvider>
            <AppInitializer>
              <ScreenManager />
              <HomeButton />
              <OrientationOverlay />
            </AppInitializer>
          </NavigationProvider>
        </GameProvider>
      </PlayerProvider>
    </DictionaryProvider>
  );
}

export { App };
