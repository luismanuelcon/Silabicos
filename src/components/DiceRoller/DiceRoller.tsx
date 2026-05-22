import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useDictionary } from '../../contexts/DictionaryContext';
import styles from './DiceRoller.module.css';

const DICE_DURATION = 0.8;
const REVEAL_DURATION = 0.5;
const IDLE_WOBBLE_DELAY = 5000;

const SPRING_TRANSITION = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 15,
};

function DiceRoller() {
  const { state: gameState, dispatch } = useGame();
  const dictionary = useDictionary();
  const shouldReduceMotion = useReducedMotion();
  const [isRolling, setIsRolling] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealSyllable, setRevealSyllable] = useState<string | null>(null);
  const [isWobbling, setIsWobbling] = useState(false);
  const wobbleTimer = useRef<ReturnType<typeof setTimeout>>();

  const isDisabled = gameState.currentSyllable !== null || isRolling || isRevealing;

  // Idle wobble system: wobble dice after inactivity when dice is available
  useEffect(() => {
    if (isDisabled || shouldReduceMotion) {
      setIsWobbling(false);
      return;
    }

    const startWobble = () => {
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 600);
    };

    wobbleTimer.current = setTimeout(startWobble, IDLE_WOBBLE_DELAY);

    // Repeat wobble every 5s
    const interval = setInterval(() => {
      wobbleTimer.current = setTimeout(startWobble, 0);
    }, IDLE_WOBBLE_DELAY + 600);

    return () => {
      clearTimeout(wobbleTimer.current);
      clearInterval(interval);
    };
  }, [isDisabled, shouldReduceMotion]);

  const handleRoll = useCallback(() => {
    if (isDisabled) return;

    const result = dictionary.getRandomSyllable(gameState.selectedWorld);

    if (shouldReduceMotion) {
      dispatch({ type: 'SET_SYLLABLE', payload: result });
      return;
    }

    setIsRolling(true);

    const timeout = setTimeout(() => {
      setIsRolling(false);
      setRevealSyllable(result.syllable);
      setIsRevealing(true);

      // After reveal, dispatch to game state
      setTimeout(() => {
        dispatch({ type: 'SET_SYLLABLE', payload: result });
        setIsRevealing(false);
        setRevealSyllable(null);
      }, REVEAL_DURATION * 1000);
    }, DICE_DURATION * 1000);

    return () => clearTimeout(timeout);
  }, [isDisabled, dictionary, gameState.selectedWorld, shouldReduceMotion, dispatch]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRoll();
    }
  }

  const displayText = revealSyllable
    ? revealSyllable.toUpperCase()
    : gameState.currentSyllable
      ? gameState.currentSyllable.toUpperCase()
      : '🎲';

  const diceClasses = [
    styles.dice,
    isDisabled && !isRolling && !isRevealing ? styles.disabled : '',
    isRolling ? styles.rolling : '',
    isRevealing ? styles.revealing : '',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={diceClasses}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={
        isRolling
          ? 'Lanzando dado...'
          : gameState.currentSyllable
            ? `Sílaba: ${gameState.currentSyllable.toUpperCase()}`
            : 'Lanzar dado'
      }
      aria-disabled={isDisabled}
      onClick={handleRoll}
      onKeyDown={handleKeyDown}
      animate={
        isRolling
          ? {
              rotateX: [0, 360, 720],
              rotateY: [0, 180, 360],
              scale: [1, 0.85, 1.1, 1],
            }
          : isRevealing
            ? {
                scale: [1, 1.2, 1.05],
                rotateZ: [0, -3, 0],
              }
            : isWobbling
              ? {
                  rotateZ: [0, -8, 8, -5, 3, 0],
                  scale: [1, 1.05, 1],
                }
              : { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }
      }
      transition={
        isRolling
          ? { duration: DICE_DURATION, ease: [0.42, 0, 0.58, 1] as const }
          : isRevealing
            ? { duration: REVEAL_DURATION, type: 'spring', stiffness: 300, damping: 12 }
            : isWobbling
              ? { duration: 0.6, ease: 'easeInOut' }
              : SPRING_TRANSITION
      }
      whileTap={
        isDisabled || shouldReduceMotion
          ? undefined
          : { scale: 0.92 }
      }
      style={{ perspective: 600 }}
    >
      <span className={styles.face} aria-hidden="true">
        {displayText}
      </span>
    </motion.div>
  );
}

export { DiceRoller };
