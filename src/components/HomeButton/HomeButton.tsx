import { useNavigation } from '../../contexts/NavigationContext';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './HomeButton.module.css';

const INITIAL_SCREENS = new Set(['avatar-select', 'welcome']);

function HomeButton() {
  const { state, dispatch } = useNavigation();
  const { state: playerState } = usePlayer();

  if (INITIAL_SCREENS.has(state.currentScreen)) {
    return null;
  }

  function handleClick() {
    if (playerState.avatarId) {
      dispatch({ type: 'NAVIGATE_TO', payload: 'welcome' });
    } else {
      dispatch({ type: 'GO_HOME' });
    }
  }

  return (
    <button
      className={styles.homeButton}
      onClick={handleClick}
      aria-label="Volver al inicio"
    >
      <svg
        className={styles.homeIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3 12L12 3L21 12M5 10V20C5 20.55 5.45 21 6 21H10V15H14V21H18C18.55 21 19 20.55 19 20V10"
          stroke="var(--color-text-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export { HomeButton };
