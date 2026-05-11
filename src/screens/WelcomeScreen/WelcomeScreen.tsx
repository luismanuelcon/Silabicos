import { motion, useReducedMotion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useNavigation } from '../../contexts/NavigationContext';
import styles from './WelcomeScreen.module.css';

const AVATAR_EMOJIS: Record<string, string> = {
  mono: '🐵',
  loro: '🦜',
  rana: '🐸',
};

function WelcomeScreen() {
  const { state: playerState } = usePlayer();
  const { dispatch: navDispatch } = useNavigation();
  const shouldReduceMotion = useReducedMotion();

  const avatarEmoji = playerState.avatarId
    ? AVATAR_EMOJIS[playerState.avatarId]
    : '🐾';

  const handleContinue = () => {
    navDispatch({ type: 'NAVIGATE_TO', payload: 'world-select' });
  };

  return (
    <div className={styles.screen}>
      <motion.div
        className={styles.avatar}
        aria-label={`Avatar: ${playerState.avatarId ?? 'desconocido'}`}
        initial={shouldReduceMotion ? false : { scale: 0, rotate: -15 }}
        animate={
          shouldReduceMotion
            ? { scale: 1 }
            : { scale: [0, 1.2, 1], rotate: [-15, 5, 0] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
        }
      >
        {avatarEmoji}
      </motion.div>

      <motion.h1
        className={styles.greeting}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.4 }}
      >
        {playerState.name
          ? `¡Hola, ${playerState.name}!`
          : '¡Hola de nuevo!'}
      </motion.h1>

      <motion.p
        className={styles.progress}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5, duration: 0.4 }}
      >
        {playerState.totalWordsCount > 0
          ? `🏆 ¡Llevas ${playerState.totalWordsCount} ${playerState.totalWordsCount === 1 ? 'palabra' : 'palabras'}!`
          : '¡Vamos a jugar!'}
      </motion.p>

      <motion.button
        className={styles.continueButton}
        onClick={handleContinue}
        aria-label="Continuar jugando"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.7, duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ¡Seguir jugando!
      </motion.button>
    </div>
  );
}

export { WelcomeScreen };
