import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScreenManager } from './ScreenManager';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { PlayerProvider } from '../../contexts/PlayerContext';
import { GameProvider } from '../../contexts/GameContext';
import { DictionaryProvider } from '../../contexts/DictionaryContext';

function renderWithProviders() {
  return render(
    <DictionaryProvider>
      <PlayerProvider>
        <GameProvider>
          <NavigationProvider>
            <ScreenManager />
          </NavigationProvider>
        </GameProvider>
      </PlayerProvider>
    </DictionaryProvider>,
  );
}

describe('ScreenManager', () => {
  it('renders the initial screen (AvatarSelect)', () => {
    renderWithProviders();
    expect(screen.getByText('¡Elige tu compañero!')).toBeInTheDocument();
  });

  it('renders the correct screen based on navigation state', () => {
    renderWithProviders();
    expect(screen.getByText('¡Elige tu compañero!')).toBeInTheDocument();
    expect(screen.queryByText('Name Input')).not.toBeInTheDocument();
  });
});
