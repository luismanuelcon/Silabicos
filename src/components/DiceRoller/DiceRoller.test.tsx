import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { DiceRoller } from './DiceRoller';
import { GameProvider } from '../../contexts/GameContext';
import { DictionaryProvider } from '../../contexts/DictionaryContext';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <DictionaryProvider>
      <GameProvider>{children}</GameProvider>
    </DictionaryProvider>
  );
}

function renderDice() {
  return render(<DiceRoller />, { wrapper });
}

describe('DiceRoller', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with dice emoji when no syllable', () => {
    renderDice();

    expect(screen.getByRole('button', { name: 'Lanzar dado' })).toBeInTheDocument();
    expect(screen.getByText('🎲')).toBeInTheDocument();
  });

  it('dispatches SET_SYLLABLE after click and animation', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderDice();

    const dice = screen.getByRole('button', { name: 'Lanzar dado' });
    await user.click(dice);

    // After roll (800ms) + reveal (500ms), syllable should be set
    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // Dice should now show a syllable (uppercase 2+ chars)
    const face = screen.getByRole('button');
    expect(face.textContent).toMatch(/^[A-Z]{2,}$/);
  });

  it('is disabled after syllable is set', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderDice();

    const dice = screen.getByRole('button', { name: 'Lanzar dado' });
    await user.click(dice);

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // Dice should now be disabled
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('shows syllable label when syllable is active', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderDice();

    await user.click(screen.getByRole('button', { name: 'Lanzar dado' }));

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(
      /^Sílaba: [A-Z]{2,}$/,
    );
  });
});
