import { motion, useReducedMotion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useGame } from '../../contexts/GameContext';
import { useNavigation } from '../../contexts/NavigationContext';
import styles from './SummaryScreen.module.css';

const AVATAR_CELEBRATE: Record<string, string> = {
  mono: '🐵',
  loro: '🦜',
  rana: '🐸',
};

function SummaryScreen() {
  const { state: playerState } = usePlayer();
  const { state: gameState } = useGame();
  const { dispatch: navDispatch } = useNavigation();
  const shouldReduceMotion = useReducedMotion();

  const sessionWords = gameState.completedWords;
  const avatarEmoji = playerState.avatarId
    ? AVATAR_CELEBRATE[playerState.avatarId]
    : '🐾';

  // Determine which words are "new" (first time ever completed)
  // A word is new if it appears in sessionWords and only appears
  // that many times in the full wordsCompleted history
  const historyCounts = new Map<string, number>();
  for (const w of playerState.wordsCompleted) {
    historyCounts.set(w, (historyCounts.get(w) ?? 0) + 1);
  }
  const sessionCounts = new Map<string, number>();
  for (const w of sessionWords) {
    sessionCounts.set(w, (sessionCounts.get(w) ?? 0) + 1);
  }

  function isNewWord(word: string): boolean {
    const historyCount = historyCounts.get(word) ?? 0;
    const sessionCount = sessionCounts.get(word) ?? 0;
    // If all occurrences in history came from this session, it's new
    return historyCount <= sessionCount;
  }

  const handlePlayAgain = () => {
    navDispatch({ type: 'NAVIGATE_TO', payload: 'world-select' });
  };

  return (
    <div className={styles.screen}>
      <motion.div
        className={styles.avatarCelebrate}
        aria-label="Tu avatar celebra"
        initial={shouldReduceMotion ? false : { scale: 0, rotate: -20 }}
        animate={
          shouldReduceMotion
            ? { scale: 1 }
            : { scale: [0, 1.3, 1], rotate: [-20, 10, 0] }
        }
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {avatarEmoji}
      </motion.div>

      <h1 className={styles.title}>¡Bien hecho!</h1>

      <p className={styles.wordCount}>
        {sessionWords.length === 0
          ? '¡Sigue intentando!'
          : `${sessionWords.length} ${sessionWords.length === 1 ? 'palabra' : 'palabras'}`}
      </p>

      {sessionWords.length > 0 && (
        <ul className={styles.wordList} aria-label="Palabras completadas">
          {sessionWords.map((word, i) => (
            <motion.li
              key={`${word}-${i}`}
              className={styles.wordItem}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay: 0.1 + i * 0.08, duration: 0.3 }
              }
            >
              <span className={styles.wordText}>{word}</span>
              {isNewWord(word) && (
                <span className={styles.newBadge} aria-label="Palabra nueva">
                  ⭐
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      )}

      <button
        className={styles.playAgainButton}
        onClick={handlePlayAgain}
        aria-label="Jugar de nuevo"
      >
        🎮 ¡Jugar de nuevo!
      </button>
    </div>
  );
}

export { SummaryScreen };
