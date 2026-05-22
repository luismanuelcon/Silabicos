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

    expect(screen.getByRole('button', { name: 'Tirar dado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dado silábico' })).toBeInTheDocument();
  });

  it('dispatches SET_SYLLABLE after click and animation', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderDice();

    const rollButton = screen.getByRole('button', { name: 'Tirar dado' });
    await user.click(rollButton);

    // After roll animation, syllable should be set
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Dice should now show a syllable (uppercase 2+ chars)
    expect(screen.getByRole('button', { name: /^Sílaba: [A-Z]{2}$/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('is disabled after syllable is set', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderDice();

    const rollButton = screen.getByRole('button', { name: 'Tirar dado' });
    await user.click(rollButton);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Roll button should now be disabled
    expect(screen.getByRole('button', { name: 'Tirar dado' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^Sílaba: [A-Z]{2}$/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('shows syllable label when syllable is active', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderDice();

    await user.click(screen.getByRole('button', { name: 'Tirar dado' }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('button', { name: /^Sílaba: [A-Z]{2}$/ })).toBeInTheDocument();
  });
});
