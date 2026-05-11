import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { GameplayScreen } from './GameplayScreen';
import { PlayerProvider } from '../../contexts/PlayerContext';
import { GameProvider } from '../../contexts/GameContext';
import { DictionaryProvider } from '../../contexts/DictionaryContext';
import { NavigationProvider } from '../../contexts/NavigationContext';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <DictionaryProvider>
      <PlayerProvider>
        <GameProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </GameProvider>
      </PlayerProvider>
    </DictionaryProvider>
  );
}

function renderScreen() {
  return render(<GameplayScreen />, { wrapper });
}

describe('GameplayScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the gameplay zones', () => {
    renderScreen();

    expect(screen.getByRole('button', { name: 'Lanzar dado' })).toBeInTheDocument();
    expect(
      screen.getByLabelText('Zona de construcción'),
    ).toBeInTheDocument();
  });

  it('hides alphabet panel when no syllable is active', () => {
    renderScreen();

    expect(screen.queryByRole('group', { name: 'Panel de letras' })).not.toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    renderScreen();

    expect(
      screen.getByText('Toca el dado para comenzar'),
    ).toBeInTheDocument();
  });

  it('renders avatar badge', () => {
    renderScreen();

    expect(screen.getByLabelText('Tu avatar')).toBeInTheDocument();
  });

  it('renders world and round info', () => {
    renderScreen();

    expect(screen.getByText(/Selva/)).toBeInTheDocument();
    expect(screen.getByText(/Ronda 1/)).toBeInTheDocument();
  });
});
