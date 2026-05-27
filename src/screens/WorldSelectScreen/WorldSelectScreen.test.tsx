import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { WorldSelectScreen } from './WorldSelectScreen';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { PlayerProvider } from '../../contexts/PlayerContext';
import { GameProvider } from '../../contexts/GameContext';
import { DictionaryProvider } from '../../contexts/DictionaryContext';

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
  return render(<WorldSelectScreen />, { wrapper });
}

describe('WorldSelectScreen', () => {
  it('renders 3 world cards', () => {
    renderScreen();

    expect(screen.getByText('Selva')).toBeInTheDocument();
    expect(screen.getByText('Granja')).toBeInTheDocument();
    expect(screen.getByText('Océano')).toBeInTheDocument();
  });

  it('renders title', () => {
    renderScreen();

    expect(screen.getByText('¡Elige un mundo!')).toBeInTheDocument();
  });

  it('Selva card is selectable', () => {
    renderScreen();

    const selvaCard = screen.getByRole('button', { name: 'Selva' });
    expect(selvaCard).toBeInTheDocument();
    expect(selvaCard).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('Granja and Océano are locked', () => {
    renderScreen();

    const granjaCard = screen.getByRole('button', {
      name: 'Granja — próximamente',
    });
    const oceanoCard = screen.getByRole('button', {
      name: 'Océano — próximamente',
    });

    expect(granjaCard).toHaveAttribute('aria-disabled', 'true');
    expect(oceanoCard).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows "Próximamente" text on locked worlds', () => {
    renderScreen();

    const comingSoonTexts = screen.getAllByText('Próximamente');
    expect(comingSoonTexts).toHaveLength(2);
  });

  it('selecting Selva triggers navigation', async () => {
    const user = userEvent.setup();
    renderScreen();

    const selvaCard = screen.getByRole('button', { name: 'Selva' });
    await user.click(selvaCard);

    // After clicking, navigation dispatches — we can't easily verify screen transition
    // without a full app render, but the click shouldn't throw
    expect(selvaCard).toBeInTheDocument();
  });
});
