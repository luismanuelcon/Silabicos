import { useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import styles from './WordBuilder.module.css';

const MAX_LETTERS_BEFORE = 2;
const MAX_LETTERS_AFTER = 2;

const EASING_BOUNCE = [0.34, 1.56, 0.64, 1] as const;

interface WordBuilderProps {
  isDragging?: boolean;
}

function WordBuilder({ isDragging = false }: WordBuilderProps) {
  const { state: gameState, dispatch } = useGame();
  const shouldReduceMotion = useReducedMotion();
  const builderRef = useRef<HTMLDivElement>(null);

  const { currentSyllable, placedLetters, syllablePosition } = gameState;

  const lettersBefore = placedLetters.filter((l) => l.position < 0);
  const lettersAfter = placedLetters.filter((l) => l.position >= 0);

  // Only show slots on the side where letters need to go
  const emptySlotsBefore = syllablePosition === 'end'
    ? Math.max(0, MAX_LETTERS_BEFORE - lettersBefore.length)
    : 0;
  const emptySlotsAfter = syllablePosition === 'start'
    ? Math.max(0, MAX_LETTERS_AFTER - lettersAfter.length)
    : 0;

  const handleRemoveLetter = useCallback(
    (index: number) => {
      dispatch({ type: 'REMOVE_LETTER', payload: index });
    },
    [dispatch],
  );

  const handleSlotClick = useCallback(
    (position: number) => {
      // Slots are clickable targets for keyboard-based letter placement
      // The actual letter placement is handled by AlphabetPanel drag
      // This is a no-op placeholder for accessibility
      void position;
    },
    [],
  );

  function getCurrentWord(): string {
    const before = lettersBefore
      .sort((a, b) => a.position - b.position)
      .map((l) => l.letter)
      .join('');
    const after = lettersAfter
      .sort((a, b) => a.position - b.position)
      .map((l) => l.letter)
      .join('');
    return `${before}${currentSyllable ?? ''}${after}`.toLowerCase();
  }

  if (!currentSyllable) {
    return (
      <div className={styles.builder} aria-label="Zona de construcción">
        <span className={styles.prompt}>Toca el dado para comenzar</span>
      </div>
    );
  }

  const currentWord = getCurrentWord();

  return (
    <div
      ref={builderRef}
      className={styles.builder}
      aria-label="Zona de construcción"
      data-word={currentWord}
    >
      {/* Empty slots before syllable */}
      {Array.from({ length: emptySlotsBefore }).map((_, i) => (
        <motion.div
          key={`before-empty-${i}`}
          className={`${styles.emptySlot}${isDragging ? ` ${styles.inviting}` : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Espacio antes de sílaba ${i + 1}`}
          onClick={() => handleSlotClick(-(emptySlotsBefore - i))}
          initial={false}
          animate={{ opacity: 1 }}
        />
      ))}

      {/* Placed letters before syllable */}
      <AnimatePresence>
        {lettersBefore
          .sort((a, b) => a.position - b.position)
          .map((pl) => {
            const originalIndex = placedLetters.indexOf(pl);
            return (
              <motion.div
                key={`before-${pl.position}-${pl.letter}`}
                className={styles.placedLetter}
                role="button"
                tabIndex={0}
                aria-label={`Letra colocada ${pl.letter}, toca para quitar`}
                onClick={() => handleRemoveLetter(originalIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRemoveLetter(originalIndex);
                  }
                }}
                initial={shouldReduceMotion ? false : { scale: 0.3, opacity: 0, y: -15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0, y: 10 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 20 }
                }
              >
                {pl.letter}
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Anchored syllable */}
      <motion.div
        className={styles.syllable}
        aria-label={`Sílaba anclada: ${currentSyllable.toLowerCase()}`}
        initial={shouldReduceMotion ? false : { scale: 0, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 300, damping: 15, mass: 1.2 }
        }
      >
        <span className={styles.syllableText}>
          {currentSyllable.toLowerCase()}
        </span>
        <span className={styles.fixedIndicator} aria-hidden="true">
          ⚓
        </span>
      </motion.div>

      {/* Placed letters after syllable */}
      <AnimatePresence>
        {lettersAfter
          .sort((a, b) => a.position - b.position)
          .map((pl) => {
            const originalIndex = placedLetters.indexOf(pl);
            return (
              <motion.div
                key={`after-${pl.position}-${pl.letter}`}
                className={styles.placedLetter}
                role="button"
                tabIndex={0}
                aria-label={`Letra colocada ${pl.letter}, toca para quitar`}
                onClick={() => handleRemoveLetter(originalIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRemoveLetter(originalIndex);
                  }
                }}
                initial={shouldReduceMotion ? false : { scale: 0.3, opacity: 0, y: -15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0, y: 10 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 20 }
                }
              >
                {pl.letter}
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Empty slots after syllable */}
      {Array.from({ length: emptySlotsAfter }).map((_, i) => (
        <motion.div
          key={`after-empty-${i}`}
          className={`${styles.emptySlot}${isDragging ? ` ${styles.inviting}` : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Espacio después de sílaba ${i + 1}`}
          onClick={() => handleSlotClick(lettersAfter.length + i)}
          initial={false}
          animate={{ opacity: 1 }}
        />
      ))}
    </div>
  );
}

export { WordBuilder, MAX_LETTERS_BEFORE, MAX_LETTERS_AFTER };
