import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { WordBuilder } from './WordBuilder';
import { GameProvider, useGame } from '../../contexts/GameContext';

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

function renderWordBuilder() {
  return render(<WordBuilder />, { wrapper });
}

// Helper to set syllable from within the test
function SetSyllableHelper({ syllable }: { syllable: string }) {
  const { dispatch } = useGame();
  return (
    <button
      onClick={() => dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: 'start' } })}
      data-testid="set-syllable"
    >
      Set
    </button>
  );
}

function AddLetterHelper({
  letter,
  position,
}: {
  letter: string;
  position: number;
}) {
  const { dispatch } = useGame();
  return (
    <button
      onClick={() =>
        dispatch({
          type: 'ADD_LETTER',
          payload: { letter, position },
        })
      }
      data-testid={`add-${letter}`}
    >
      Add {letter}
    </button>
  );
}

function renderWithHelpers(syllable: string) {
  return render(
    <GameProvider>
      <SetSyllableHelper syllable={syllable} />
      <AddLetterHelper letter="p" position={-1} />
      <AddLetterHelper letter="a" position={0} />
      <WordBuilder />
    </GameProvider>,
  );
}

describe('WordBuilder', () => {
  it('shows prompt when no syllable', () => {
    renderWordBuilder();

    expect(
      screen.getByText('Toca el dado para comenzar'),
    ).toBeInTheDocument();
  });

  it('shows anchored syllable when set', async () => {
    const user = userEvent.setup();
    renderWithHelpers('ma');

    await user.click(screen.getByTestId('set-syllable'));

    expect(
      screen.getByLabelText('Sílaba anclada: ma'),
    ).toBeInTheDocument();
    expect(screen.getByText('ma')).toBeInTheDocument();
  });

  it('shows empty slots after syllable (start position)', async () => {
    const user = userEvent.setup();
    renderWithHelpers('ma');

    await user.click(screen.getByTestId('set-syllable'));

    const afterSlots = screen.getAllByLabelText(/Espacio después de sílaba/);
    expect(afterSlots.length).toBeGreaterThan(0);

    // No before slots when syllable is at start
    const beforeSlots = screen.queryAllByLabelText(/Espacio antes de sílaba/);
    expect(beforeSlots.length).toBe(0);
  });

  it('shows placed letters and allows removal', async () => {
    const user = userEvent.setup();
    renderWithHelpers('ma');

    await user.click(screen.getByTestId('set-syllable'));
    await user.click(screen.getByTestId('add-a'));

    const placedLetter = screen.getByLabelText(
      'Letra colocada a, toca para quitar',
    );
    expect(placedLetter).toBeInTheDocument();

    // Click to remove
    await user.click(placedLetter);

    await waitFor(() => {
      expect(
        screen.queryByLabelText('Letra colocada a, toca para quitar'),
      ).not.toBeInTheDocument();
    });
  });

  it('syllable cannot be removed', async () => {
    const user = userEvent.setup();
    renderWithHelpers('ma');

    await user.click(screen.getByTestId('set-syllable'));

    const syllable = screen.getByLabelText('Sílaba anclada: ma');
    // Syllable has no click handler for removal — it stays put
    expect(syllable).toBeInTheDocument();
    // No role="button" on syllable (it's a plain div)
    expect(syllable.getAttribute('role')).toBeNull();
  });

  it('exposes current word via data attribute', async () => {
    const user = userEvent.setup();
    renderWithHelpers('ma');

    await user.click(screen.getByTestId('set-syllable'));
    await user.click(screen.getByTestId('add-a'));

    const builder = screen.getByLabelText('Zona de construcción');
    expect(builder.getAttribute('data-word')).toBe('maa');
  });
});
