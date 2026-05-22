import { useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import styles from './DiceRoller.module.css';

const DICE_DURATION_MS = 900;

const FACE_SYLLABLES = ['ma', 'pa', 'sa', 'la', 'ca', 'ta'] as const;
const FACE_CLASSES = [
  'showFront',
  'showBack',
  'showRight',
  'showLeft',
  'showTop',
  'showBottom',
] as const;

function DiceRoller() {
  const { state: gameState, dispatch } = useGame();
  const shouldReduceMotion = useReducedMotion();
  const [rolling, setRolling] = useState(false);
  const [selectedSyllable, setSelectedSyllable] = useState('');
  const [rotationClass, setRotationClass] = useState<string>(styles.showFront);

  const isDisabled = gameState.currentSyllable !== null || rolling;

  const handleRoll = useCallback(() => {
    if (isDisabled) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * FACE_SYLLABLES.length);
    const syllable = FACE_SYLLABLES[randomIndex];
    const faceClass = styles[FACE_CLASSES[randomIndex]];

    if (shouldReduceMotion) {
      setRotationClass(faceClass);
      setSelectedSyllable(syllable.toUpperCase());
      dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: 'start' } });
      return;
    }

    setRolling(true);
    setSelectedSyllable('');

    setTimeout(() => {
      setRotationClass(faceClass);
      setSelectedSyllable(syllable.toUpperCase());
      dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: 'start' } });
      setRolling(false);
    }, DICE_DURATION_MS);
  }, [isDisabled, shouldReduceMotion, dispatch]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRoll();
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scene}>
        <div
          className={[
            styles.dice,
            rotationClass,
            rolling ? styles.rolling : '',
            isDisabled ? styles.disabled : '',
          ].filter(Boolean).join(' ')}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label={
            rolling
              ? 'Lanzando dado...'
              : selectedSyllable
                ? `Sílaba: ${selectedSyllable}`
                : 'Dado silábico'
          }
          aria-disabled={isDisabled}
          onClick={handleRoll}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.faceLight} aria-hidden="true" />
          <div className={`${styles.face} ${styles.faceFront}`}>ma</div>
          <div className={`${styles.face} ${styles.faceBack}`}>pa</div>
          <div className={`${styles.face} ${styles.faceRight}`}>sa</div>
          <div className={`${styles.face} ${styles.faceLeft}`}>la</div>
          <div className={`${styles.face} ${styles.faceTop}`}>ca</div>
          <div className={`${styles.face} ${styles.faceBottom}`}>ta</div>
        </div>
        <div className={`${styles.shadow} ${rolling ? styles.shadowRolling : ''}`} aria-hidden="true" />
      </div>

      <button
        type="button"
        className={styles.rollButton}
        onClick={handleRoll}
        disabled={isDisabled}
      >
        {rolling ? 'Girando...' : 'Tirar dado'}
      </button>

      {selectedSyllable && <div className={styles.result}>Resultado: {selectedSyllable}</div>}
    </div>
  );
}

export { DiceRoller };
