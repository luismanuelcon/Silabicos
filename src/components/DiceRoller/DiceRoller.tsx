import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useDictionary } from '../../contexts/DictionaryContext';
import styles from './DiceRoller.module.css';

const DICE_DURATION = 0.8;

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

  const isDisabled = gameState.currentSyllable !== null || isRolling;

  const handleRoll = useCallback(() => {
    if (isDisabled) return;

    const syllable = dictionary.getRandomSyllable(gameState.selectedWorld);

    if (shouldReduceMotion) {
      dispatch({ type: 'SET_SYLLABLE', payload: syllable });
      return;
    }

    setIsRolling(true);

    const timeout = setTimeout(() => {
      dispatch({ type: 'SET_SYLLABLE', payload: syllable });
      setIsRolling(false);
    }, DICE_DURATION * 1000);

    return () => clearTimeout(timeout);
  }, [isDisabled, dictionary, gameState.selectedWorld, shouldReduceMotion, dispatch]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRoll();
    }
  }

  const displayText = gameState.currentSyllable
    ? gameState.currentSyllable.toUpperCase()
    : '🎲';

  return (
    <motion.div
      className={`${styles.dice} ${isDisabled && !isRolling ? styles.disabled : ''}`}
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
              scale: [1, 0.85, 1],
            }
          : { rotateX: 0, rotateY: 0, scale: 1 }
      }
      transition={
        isRolling
          ? { duration: DICE_DURATION, ease: [0.42, 0, 0.58, 1] as const }
          : SPRING_TRANSITION
      }
      whileTap={
        isDisabled || shouldReduceMotion
          ? undefined
          : { scale: 0.95 }
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
