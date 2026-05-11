import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisualHint } from './VisualHint';
import type { DictionaryEntry } from '../../types/dictionary';

describe('VisualHint', () => {
  it('renders icon for known word', () => {
    const match: DictionaryEntry = { word: 'casa', difficulty: 'easy' };
    render(<VisualHint match={match} />);

    expect(screen.getByRole('status', { name: 'Pista visual' })).toBeInTheDocument();
    expect(screen.getByText('🏠')).toBeInTheDocument();
  });

  it('renders default icon for unknown word', () => {
    const match: DictionaryEntry = { word: 'xyz', difficulty: 'easy' };
    render(<VisualHint match={match} />);

    expect(screen.getByText('💡')).toBeInTheDocument();
  });

  it('renders nothing when match is null', () => {
    const { container } = render(<VisualHint match={null} />);

    expect(container.textContent).toBe('');
  });
});
