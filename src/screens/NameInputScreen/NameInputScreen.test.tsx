import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerProvider, usePlayer } from '../../contexts/PlayerContext';
import { NavigationProvider, useNavigation } from '../../contexts/NavigationContext';
import { NameInputScreen } from './NameInputScreen';
import { useEffect } from 'react';

function renderWithProviders(presetAvatar = true) {
  function SetAvatar({ children }: { children: React.ReactNode }) {
    const { dispatch } = usePlayer();
    useEffect(() => {
      if (presetAvatar) {
        dispatch({ type: 'SET_AVATAR', payload: 'mono' });
      }
    }, [dispatch]);
    return <>{children}</>;
  }

  return render(
    <PlayerProvider>
      <NavigationProvider>
        <SetAvatar>
          <NameInputScreen />
        </SetAvatar>
      </NavigationProvider>
    </PlayerProvider>,
  );
}

function PlayerStateReader() {
  const { state } = usePlayer();
  return <span data-testid="player-name">{state.name}</span>;
}

function NavStateReader() {
  const { state } = useNavigation();
  return <span data-testid="current-screen">{state.currentScreen}</span>;
}

function renderWithReaders() {
  function SetAvatar({ children }: { children: React.ReactNode }) {
    const { dispatch } = usePlayer();
    useEffect(() => {
      dispatch({ type: 'SET_AVATAR', payload: 'loro' });
    }, [dispatch]);
    return <>{children}</>;
  }

  return render(
    <PlayerProvider>
      <NavigationProvider>
        <SetAvatar>
          <NameInputScreen />
          <PlayerStateReader />
          <NavStateReader />
        </SetAvatar>
      </NavigationProvider>
    </PlayerProvider>,
  );
}

describe('NameInputScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders input with placeholder and aria-label', () => {
    renderWithProviders();

    const input = screen.getByLabelText('Escribe tu nombre');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Tu nombre...');
  });

  it('renders skip button always', () => {
    renderWithProviders();

    expect(
      screen.getByRole('button', { name: 'Saltar sin nombre' }),
    ).toBeInTheDocument();
  });

  it('does not show confirm button when input is empty', () => {
    renderWithProviders();

    expect(
      screen.queryByRole('button', { name: 'Confirmar nombre' }),
    ).not.toBeInTheDocument();
  });

  it('shows confirm button when input has text', () => {
    renderWithProviders();

    const input = screen.getByLabelText('Escribe tu nombre');
    fireEvent.change(input, { target: { value: 'Luna' } });

    expect(
      screen.getByRole('button', { name: 'Confirmar nombre' }),
    ).toBeInTheDocument();
  });

  it('confirms name and navigates to world-select', () => {
    renderWithReaders();

    const input = screen.getByLabelText('Escribe tu nombre');
    fireEvent.change(input, { target: { value: 'Valentina' } });
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar nombre' }),
    );

    expect(screen.getByTestId('player-name').textContent).toBe('Valentina');
    expect(screen.getByTestId('current-screen').textContent).toBe(
      'world-select',
    );
  });

  it('skips without setting name and navigates', () => {
    renderWithReaders();

    fireEvent.click(
      screen.getByRole('button', { name: 'Saltar sin nombre' }),
    );

    expect(screen.getByTestId('player-name').textContent).toBe('');
    expect(screen.getByTestId('current-screen').textContent).toBe(
      'world-select',
    );
  });

  it('input respects maxLength of 12', () => {
    renderWithProviders();

    const input = screen.getByLabelText('Escribe tu nombre');
    expect(input).toHaveAttribute('maxLength', '12');
  });

  it('Enter key with text confirms name', () => {
    renderWithReaders();

    const input = screen.getByLabelText('Escribe tu nombre');
    fireEvent.change(input, { target: { value: 'Mateo' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('player-name').textContent).toBe('Mateo');
    expect(screen.getByTestId('current-screen').textContent).toBe(
      'world-select',
    );
  });

  it('Enter key with empty input skips', () => {
    renderWithReaders();

    const input = screen.getByLabelText('Escribe tu nombre');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('player-name').textContent).toBe('');
    expect(screen.getByTestId('current-screen').textContent).toBe(
      'world-select',
    );
  });

  it('shows selected avatar from PlayerContext', () => {
    renderWithProviders(true);

    const avatar = screen.getByAltText('mono');
    expect(avatar).toBeInTheDocument();
  });

  it('renders title', () => {
    renderWithProviders();

    expect(screen.getByText('¿Cómo te llamas?')).toBeInTheDocument();
  });

  it('trims whitespace from name before saving', () => {
    renderWithReaders();

    const input = screen.getByLabelText('Escribe tu nombre');
    fireEvent.change(input, { target: { value: '  Ana  ' } });
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar nombre' }),
    );

    expect(screen.getByTestId('player-name').textContent).toBe('Ana');
  });
});
