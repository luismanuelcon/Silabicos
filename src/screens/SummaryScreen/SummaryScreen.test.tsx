import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { SummaryScreen } from './SummaryScreen';
import { PlayerProvider, usePlayer } from '../../contexts/PlayerContext';
import { GameProvider, useGame } from '../../contexts/GameContext';
import { NavigationProvider, useNavigation } from '../../contexts/NavigationContext';
import { DictionaryProvider } from '../../contexts/DictionaryContext';

function Wrapper({ children }: { children: ReactNode }) {
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

function SetupSession({
  words,
  children,
}: {
  words: string[];
  children: ReactNode;
}) {
  const { dispatch: gameDispatch } = useGame();
  const { dispatch: playerDispatch } = usePlayer();

  useEffect(() => {
    gameDispatch({ type: 'START_SESSION', payload: 'selva' });
    for (const word of words) {
      gameDispatch({ type: 'COMPLETE_WORD', payload: word });
      playerDispatch({ type: 'ADD_COMPLETED_WORD', payload: word });
    }
    gameDispatch({ type: 'END_SESSION' });
  }, [gameDispatch, playerDispatch, words]);

  return <>{children}</>;
}

function NavReader() {
  const { state } = useNavigation();
  return <span data-testid="current-screen">{state.currentScreen}</span>;
}

function renderSummary(words: string[] = []) {
  return render(
    <Wrapper>
      <SetupSession words={words}>
        <SummaryScreen />
        <NavReader />
      </SetupSession>
    </Wrapper>,
  );
}

describe('SummaryScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders title and avatar', () => {
    renderSummary();

    expect(screen.getByText('¡Bien hecho!')).toBeInTheDocument();
  });

  it('shows session words', () => {
    renderSummary(['mama', 'papa']);

    expect(screen.getByText('mama')).toBeInTheDocument();
    expect(screen.getByText('papa')).toBeInTheDocument();
  });

  it('shows word count', () => {
    renderSummary(['mama', 'papa', 'casa']);

    expect(screen.getByText('3 palabras')).toBeInTheDocument();
  });

  it('shows singular word count', () => {
    renderSummary(['mama']);

    expect(screen.getByText('1 palabra')).toBeInTheDocument();
  });

  it('shows encouragement when no words', () => {
    renderSummary([]);

    expect(screen.getByText('¡Sigue intentando!')).toBeInTheDocument();
  });

  it('marks new words with star badge', () => {
    renderSummary(['mama']);

    expect(screen.getByLabelText('Palabra nueva')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('renders play again button with min height', () => {
    renderSummary();

    const button = screen.getByRole('button', { name: 'Jugar de nuevo' });
    expect(button).toBeInTheDocument();
  });

  it('navigates to world-select on play again', () => {
    renderSummary(['mama']);

    fireEvent.click(screen.getByRole('button', { name: 'Jugar de nuevo' }));

    expect(screen.getByTestId('current-screen').textContent).toBe(
      'world-select',
    );
  });

  it('renders word list with aria-label', () => {
    renderSummary(['mama']);

    expect(
      screen.getByRole('list', { name: 'Palabras completadas' }),
    ).toBeInTheDocument();
  });
});
