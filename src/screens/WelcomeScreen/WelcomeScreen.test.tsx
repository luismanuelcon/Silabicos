import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { PlayerProvider, usePlayer } from '../../contexts/PlayerContext';
import { NavigationProvider, useNavigation } from '../../contexts/NavigationContext';

function SetupProfile({
  children,
  name,
  words,
}: {
  children: ReactNode;
  name?: string;
  words?: number;
}) {
  const { dispatch } = usePlayer();
  useEffect(() => {
    dispatch({ type: 'SET_AVATAR', payload: 'mono' });
    if (name) dispatch({ type: 'SET_NAME', payload: name });
    if (words) {
      for (let i = 0; i < words; i++) {
        dispatch({ type: 'ADD_COMPLETED_WORD', payload: `word${i}` });
      }
    }
  }, [dispatch, name, words]);
  return <>{children}</>;
}

function NavReader() {
  const { state } = useNavigation();
  return <span data-testid="current-screen">{state.currentScreen}</span>;
}

function renderWelcome(name = 'Luna', words = 5) {
  return render(
    <PlayerProvider>
      <NavigationProvider>
        <SetupProfile name={name} words={words}>
          <WelcomeScreen />
          <NavReader />
        </SetupProfile>
      </NavigationProvider>
    </PlayerProvider>,
  );
}

describe('WelcomeScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders greeting with player name', () => {
    renderWelcome('Luna');

    expect(screen.getByText('¡Hola, Luna!')).toBeInTheDocument();
  });

  it('renders generic greeting without name', () => {
    renderWelcome('');

    expect(screen.getByText('¡Hola de nuevo!')).toBeInTheDocument();
  });

  it('shows avatar emoji', () => {
    renderWelcome();

    expect(screen.getByText('🐵')).toBeInTheDocument();
  });

  it('shows word count progress', () => {
    renderWelcome('Luna', 7);

    expect(screen.getByText(/llevas 7 palabras/i)).toBeInTheDocument();
  });

  it('shows singular word count', () => {
    renderWelcome('Luna', 1);

    expect(screen.getByText(/llevas 1 palabra!/i)).toBeInTheDocument();
  });

  it('shows play message when 0 words', () => {
    renderWelcome('Luna', 0);

    expect(screen.getByText('¡Vamos a jugar!')).toBeInTheDocument();
  });

  it('renders continue button', () => {
    renderWelcome();

    expect(
      screen.getByRole('button', { name: 'Continuar jugando' }),
    ).toBeInTheDocument();
  });

  it('navigates to world-select on continue', () => {
    renderWelcome();

    fireEvent.click(
      screen.getByRole('button', { name: 'Continuar jugando' }),
    );

    expect(screen.getByTestId('current-screen').textContent).toBe(
      'world-select',
    );
  });
});
