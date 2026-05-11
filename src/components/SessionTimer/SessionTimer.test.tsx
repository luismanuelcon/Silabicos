import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SessionTimer } from './SessionTimer';

describe('SessionTimer', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return window.setTimeout(() => cb(performance.now()), 16);
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      window.clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with timer role and aria-label', () => {
    render(
      <SessionTimer
        durationSeconds={180}
        active={false}
        onTimeUp={vi.fn()}
      />,
    );

    const timer = screen.getByRole('timer', {
      name: 'Temporizador de sesión',
    });
    expect(timer).toBeInTheDocument();
  });

  it('renders sun emoji', () => {
    render(
      <SessionTimer
        durationSeconds={180}
        active={false}
        onTimeUp={vi.fn()}
      />,
    );

    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('starts at 0% progress', () => {
    render(
      <SessionTimer
        durationSeconds={180}
        active={false}
        onTimeUp={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('timer').getAttribute('aria-valuenow'),
    ).toBe('0');
  });

  it('calls onTimeUp when time expires', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onTimeUp = vi.fn();

    // Mock performance.now to advance
    let time = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => time);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return window.setTimeout(() => {
        time += 200000; // Jump past duration (180s = 180000ms)
        cb(time);
      }, 0) as unknown as number;
    });

    render(
      <SessionTimer durationSeconds={180} active={true} onTimeUp={onTimeUp} />,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onTimeUp).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('does not call onTimeUp when inactive', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onTimeUp = vi.fn();

    render(
      <SessionTimer
        durationSeconds={180}
        active={false}
        onTimeUp={onTimeUp}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(200000);
    });

    expect(onTimeUp).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
