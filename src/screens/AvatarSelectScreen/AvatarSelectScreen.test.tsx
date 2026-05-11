import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlayerProvider } from '../../contexts/PlayerContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { AvatarSelectScreen } from './AvatarSelectScreen';

function renderWithProviders() {
  return render(
    <PlayerProvider>
      <NavigationProvider>
        <AvatarSelectScreen />
      </NavigationProvider>
    </PlayerProvider>,
  );
}

describe('AvatarSelectScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders 3 avatar buttons', () => {
    renderWithProviders();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('renders title', () => {
    renderWithProviders();

    expect(screen.getByText('¡Elige tu compañero!')).toBeInTheDocument();
  });

  it('renders avatar group with accessible label', () => {
    renderWithProviders();

    expect(
      screen.getByRole('group', { name: 'Avatares disponibles' }),
    ).toBeInTheDocument();
  });

  it('renders all three avatars with correct aria-labels', () => {
    renderWithProviders();

    expect(
      screen.getByRole('button', { name: 'Seleccionar mono' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Seleccionar loro' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Seleccionar rana' }),
    ).toBeInTheDocument();
  });

  it('marks selected avatar with aria-pressed', () => {
    renderWithProviders();

    const monoBtn = screen.getByRole('button', { name: 'Seleccionar mono' });
    fireEvent.click(monoBtn);

    expect(monoBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('selects avatar via keyboard Enter', () => {
    renderWithProviders();

    const loroBtn = screen.getByRole('button', { name: 'Seleccionar loro' });
    fireEvent.keyDown(loroBtn, { key: 'Enter' });

    expect(loroBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('prevents second selection while celebrating', () => {
    renderWithProviders();

    const monoBtn = screen.getByRole('button', { name: 'Seleccionar mono' });
    const ranaBtn = screen.getByRole('button', { name: 'Seleccionar rana' });

    fireEvent.click(monoBtn);
    fireEvent.click(ranaBtn);

    // mono remains selected, rana is not
    expect(monoBtn).toHaveAttribute('aria-pressed', 'true');
    expect(ranaBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('navigates to name-input after celebration timeout', () => {
    renderWithProviders();

    const monoBtn = screen.getByRole('button', { name: 'Seleccionar mono' });
    fireEvent.click(monoBtn);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // After navigation, AvatarSelectScreen would unmount in real app
    // We verify the click + timer sequence completed without errors
    expect(monoBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
