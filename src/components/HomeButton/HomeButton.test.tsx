import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomeButton } from './HomeButton';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { PlayerProvider } from '../../contexts/PlayerContext';

function renderHomeButton() {
  return render(
    <PlayerProvider>
      <NavigationProvider>
        <HomeButton />
      </NavigationProvider>
    </PlayerProvider>,
  );
}

describe('HomeButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is hidden on the initial screen (avatar-select)', () => {
    renderHomeButton();
    expect(
      screen.queryByRole('button', { name: 'Volver al inicio' }),
    ).not.toBeInTheDocument();
  });
});
