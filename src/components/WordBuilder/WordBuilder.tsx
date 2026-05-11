import { useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import styles from './WordBuilder.module.css';

const MAX_LETTERS_BEFORE = 3;
const MAX_LETTERS_AFTER = 4;

const EASING_BOUNCE = [0.34, 1.56, 0.64, 1] as const;

function WordBuilder() {
  const { state: gameState, dispatch } = useGame();
  const shouldReduceMotion = useReducedMotion();
  const builderRef = useRef<HTMLDivElement>(null);

  const { currentSyllable, placedLetters } = gameState;

  const lettersBefore = placedLetters.filter((l) => l.position < 0);
  const lettersAfter = placedLetters.filter((l) => l.position >= 0);

  const emptySlotsBefore = Math.max(
    0,
    MAX_LETTERS_BEFORE - lettersBefore.length,
  );
  const emptySlotsAfter = Math.max(
    0,
    MAX_LETTERS_AFTER - lettersAfter.length,
  );

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
          className={styles.emptySlot}
          role="button"
          tabIndex={0}
          aria-label={`Espacio antes de sílaba ${i + 1}`}
          onClick={() => handleSlotClick(-(emptySlotsBefore - i))}
          initial={false}
          animate={{ opacity: 1 }}
        />
      ))}

      {/* Placed letters before syllable */}
      {lettersBefore
        .sort((a, b) => a.position - b.position)
        .map((pl, i) => {
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
              initial={shouldReduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.15, ease: [...EASING_BOUNCE] }
              }
            >
              {pl.letter}
            </motion.div>
          );
        })}

      {/* Anchored syllable */}
      <div className={styles.syllable} aria-label={`Sílaba anclada: ${currentSyllable.toUpperCase()}`}>
        <span className={styles.syllableText}>
          {currentSyllable.toUpperCase()}
        </span>
        <span className={styles.fixedIndicator} aria-hidden="true">
          ⚓
        </span>
      </div>

      {/* Placed letters after syllable */}
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
              initial={shouldReduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.15, ease: [...EASING_BOUNCE] }
              }
            >
              {pl.letter}
            </motion.div>
          );
        })}

      {/* Empty slots after syllable */}
      {Array.from({ length: emptySlotsAfter }).map((_, i) => (
        <motion.div
          key={`after-empty-${i}`}
          className={styles.emptySlot}
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
