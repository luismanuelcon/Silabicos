import { useOrientation } from '../../hooks/useOrientation';
import styles from './OrientationOverlay.module.css';

function OrientationOverlay() {
  const isPortrait = useOrientation();

  if (!isPortrait) {
    return null;
  }

  return (
    <div className={styles.overlay} aria-live="polite" role="alert">
      <div className={styles.content}>
        <svg
          className={styles.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="12"
            y="4"
            width="40"
            height="56"
            rx="6"
            stroke="var(--color-coral)"
            strokeWidth="3"
            fill="var(--color-surface)"
          />
          <circle cx="32" cy="52" r="3" fill="var(--color-coral)" />
          <path
            d="M44 32 L52 24 M52 24 L52 32 M52 24 L44 24"
            stroke="var(--color-mint)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className={styles.message}>¡Gira tu dispositivo!</p>
      </div>
    </div>
  );
}

export { OrientationOverlay };
