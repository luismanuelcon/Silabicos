import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlphabetPanel, SPANISH_ALPHABET } from './AlphabetPanel';

describe('AlphabetPanel', () => {
  it('renders all 27 Spanish letters', () => {
    render(<AlphabetPanel />);

    for (const letter of SPANISH_ALPHABET) {
      expect(
        screen.getByRole('button', { name: `Letra ${letter}` }),
      ).toBeInTheDocument();
    }
  });

  it('renders 27 letter tiles', () => {
    render(<AlphabetPanel />);

    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(27);
  });

  it('includes ñ in the alphabet', () => {
    render(<AlphabetPanel />);

    expect(
      screen.getByRole('button', { name: 'Letra ñ' }),
    ).toBeInTheDocument();
  });

  it('has panel group role', () => {
    render(<AlphabetPanel />);

    expect(
      screen.getByRole('group', { name: 'Panel de letras' }),
    ).toBeInTheDocument();
  });
});
