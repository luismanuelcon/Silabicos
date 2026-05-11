import { useNavigation } from '../../contexts/NavigationContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { useGame } from '../../contexts/GameContext';
import { WorldCard } from '../../components/WorldCard/WorldCard';
import type { WorldId } from '../../types/dictionary';
import styles from './WorldSelectScreen.module.css';

function WorldSelectScreen() {
  const { dispatch: navDispatch } = useNavigation();
  const { state: playerState } = usePlayer();
  const { dispatch: gameDispatch } = useGame();

  function handleSelectWorld(worldId: WorldId) {
    gameDispatch({ type: 'START_SESSION', payload: worldId });
    navDispatch({ type: 'NAVIGATE_TO', payload: 'gameplay' });
  }

  return (
    <div className={styles.screen}>
      {playerState.name && (
        <p className={styles.greeting}>
          ¡Hola, {playerState.name}!
        </p>
      )}
      <h1 className={styles.title}>¡Elige un mundo!</h1>
      <div className={styles.grid}>
        <WorldCard
          worldId="selva"
          locked={false}
          onSelect={handleSelectWorld}
          label="Selva"
        />
        <WorldCard
          worldId="granja"
          locked={true}
          onSelect={handleSelectWorld}
          label="Granja"
        />
        <WorldCard
          worldId="oceano"
          locked={true}
          onSelect={handleSelectWorld}
          label="Océano"
        />
      </div>
    </div>
  );
}

export { WorldSelectScreen };
