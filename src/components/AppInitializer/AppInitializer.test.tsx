import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerProvider } from '../../contexts/PlayerContext';
import { NavigationProvider, useNavigation } from '../../contexts/NavigationContext';
import { GameProvider } from '../../contexts/GameContext';
import { DictionaryProvider } from '../../contexts/DictionaryContext';
import { AppInitializer } from './AppInitializer';
import { saveProfile } from '../../services/storageService';

function NavReader() {
  const { state } = useNavigation();
  return <span data-testid="current-screen">{state.currentScreen}</span>;
}

function renderWithInit() {
  return render(
    <DictionaryProvider>
      <PlayerProvider>
        <GameProvider>
          <NavigationProvider>
            <AppInitializer>
              <NavReader />
            </AppInitializer>
          </NavigationProvider>
        </GameProvider>
      </PlayerProvider>
    </DictionaryProvider>,
  );
}

describe('AppInitializer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stays on avatar-select when no profile exists', () => {
    renderWithInit();

    expect(screen.getByTestId('current-screen').textContent).toBe(
      'avatar-select',
    );
  });

  it('navigates to welcome when profile exists', () => {
    saveProfile({ avatarId: 'mono', name: 'Luna', totalWordsCount: 5 });

    renderWithInit();

    expect(screen.getByTestId('current-screen').textContent).toBe('welcome');
  });
});
