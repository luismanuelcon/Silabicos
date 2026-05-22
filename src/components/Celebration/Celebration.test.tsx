import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Celebration } from './Celebration';

describe('Celebration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders word in uppercase', () => {
    const onComplete = vi.fn();
    render(<Celebration word="mama" onComplete={onComplete} />);

    expect(screen.getByText('MAMA')).toBeInTheDocument();
  });

  it('shows celebration alert', () => {
    const onComplete = vi.fn();
    render(<Celebration word="mama" onComplete={onComplete} />);

    expect(
      screen.getByRole('alert', { name: /formaste mama/i }),
    ).toBeInTheDocument();
  });

  it('calls onComplete after duration', () => {
    const onComplete = vi.fn();
    render(<Celebration word="mama" onComplete={onComplete} />);

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders session-end variant with word count', () => {
    const onComplete = vi.fn();
    render(
      <Celebration
        word=""
        variant="session-end"
        wordsCount={5}
        onComplete={onComplete}
      />,
    );

    expect(
      screen.getByRole('alert', { name: /completaste 5 palabras/i }),
    ).toBeInTheDocument();
  });

  it('session-end variant uses longer duration', () => {
    const onComplete = vi.fn();
    render(
      <Celebration
        word=""
        variant="session-end"
        wordsCount={3}
        onComplete={onComplete}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
