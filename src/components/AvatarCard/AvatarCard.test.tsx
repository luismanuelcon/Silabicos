import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AvatarCard } from './AvatarCard';

describe('AvatarCard', () => {
  it('renders with correct aria-label', () => {
    render(
      <AvatarCard
        avatarId="mono"
        selected={false}
        onSelect={vi.fn()}
        celebrating={false}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Seleccionar mono' }),
    ).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = vi.fn();
    render(
      <AvatarCard
        avatarId="loro"
        selected={false}
        onSelect={handleSelect}
        celebrating={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar loro' }));
    expect(handleSelect).toHaveBeenCalledWith('loro');
  });

  it('calls onSelect on Enter key', () => {
    const handleSelect = vi.fn();
    render(
      <AvatarCard
        avatarId="rana"
        selected={false}
        onSelect={handleSelect}
        celebrating={false}
      />,
    );

    fireEvent.keyDown(
      screen.getByRole('button', { name: 'Seleccionar rana' }),
      { key: 'Enter' },
    );
    expect(handleSelect).toHaveBeenCalledWith('rana');
  });

  it('calls onSelect on Space key', () => {
    const handleSelect = vi.fn();
    render(
      <AvatarCard
        avatarId="mono"
        selected={false}
        onSelect={handleSelect}
        celebrating={false}
      />,
    );

    fireEvent.keyDown(
      screen.getByRole('button', { name: 'Seleccionar mono' }),
      { key: ' ' },
    );
    expect(handleSelect).toHaveBeenCalledWith('mono');
  });

  it('does not call onSelect while celebrating', () => {
    const handleSelect = vi.fn();
    render(
      <AvatarCard
        avatarId="mono"
        selected={true}
        onSelect={handleSelect}
        celebrating={true}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar mono' }));
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('has aria-pressed when selected', () => {
    render(
      <AvatarCard
        avatarId="loro"
        selected={true}
        onSelect={vi.fn()}
        celebrating={false}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Seleccionar loro' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders avatar image with alt text', () => {
    render(
      <AvatarCard
        avatarId="rana"
        selected={false}
        onSelect={vi.fn()}
        celebrating={false}
      />,
    );

    expect(screen.getByAltText('rana')).toBeInTheDocument();
  });
});
