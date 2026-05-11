import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LetterTile } from './LetterTile';

describe('LetterTile', () => {
  it('renders the letter', () => {
    render(<LetterTile letter="A" />);

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<LetterTile letter="Ñ" />);

    expect(
      screen.getByRole('button', { name: 'Letra Ñ' }),
    ).toBeInTheDocument();
  });

  it('is focusable', () => {
    render(<LetterTile letter="M" />);

    const tile = screen.getByRole('button', { name: 'Letra M' });
    expect(tile).toHaveAttribute('tabIndex', '0');
  });
});
