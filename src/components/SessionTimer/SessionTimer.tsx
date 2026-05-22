import { useEffect, useRef, useState } from 'react';
import styles from './SessionTimer.module.css';

interface SessionTimerProps {
  durationSeconds: number;
  active: boolean;
  onTimeUp: () => void;
}

function SessionTimer({ durationSeconds, active, onTimeUp }: SessionTimerProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      startTimeRef.current = null;
      completedRef.current = false;
      return;
    }

    function tick(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const fraction = Math.min(elapsed / durationSeconds, 1);
      setProgress(fraction);

      if (fraction >= 1 && !completedRef.current) {
        completedRef.current = true;
        onTimeUp();
        return;
      }

      if (fraction < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, durationSeconds, onTimeUp]);

  // Arc: sun moves from left (0%) to right (100%) along a semicircular path
  // x: 5% → 95%, y: semicircle arc (higher in middle)
  const x = 5 + progress * 90; // 5% to 95%
  const arcHeight = 60; // max vertical displacement in %
  const y = 100 - arcHeight * Math.sin(progress * Math.PI); // parabolic arc

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className={styles.timer}
      role="timer"
      aria-label="Temporizador de sesión"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      {/* SVG arc path indicator */}
      <svg className={styles.arc} viewBox="0 0 200 80" aria-hidden="true">
        <path
          className={styles.arcPath}
          d="M 20 70 A 80 60 0 0 1 180 70"
        />
      </svg>

      {/* Sun */}
      <div
        className={styles.sun}
        aria-hidden="true"
        style={
          reducedMotion
            ? { left: `${x}%`, bottom: `${y}%` }
            : {
                left: `${x}%`,
                bottom: `${y}%`,
                transition: 'left 0.5s linear, bottom 0.5s linear',
              }
        }
      >
        ☀️
      </div>
    </div>
  );
}

export { SessionTimer };
