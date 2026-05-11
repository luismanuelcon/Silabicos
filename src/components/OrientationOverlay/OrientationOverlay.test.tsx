import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrientationOverlay } from './OrientationOverlay';

describe('OrientationOverlay', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  it('does not render when in landscape orientation', () => {
    render(<OrientationOverlay />);
    expect(
      screen.queryByText('¡Gira tu dispositivo!'),
    ).not.toBeInTheDocument();
  });

  it('renders overlay when in portrait orientation', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(orientation: portrait)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<OrientationOverlay />);
    expect(screen.getByText('¡Gira tu dispositivo!')).toBeInTheDocument();
  });
});
