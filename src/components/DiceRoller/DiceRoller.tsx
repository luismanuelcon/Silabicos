import { useState, useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import {
  DiceCube3D,
  createDiceRollProfile,
  getFaceOrientation,
  type DiceRollProfile,
  type DiceOrientation,
} from '../DiceCube3D';
import styles from './DiceRoller.module.css';

const DICE_DURATION_MS = 2500;

const FACE_SYLLABLES = ['ma', 'pa', 'sa', 'la', 'ca', 'ta'] as const;
const FACE_CLASSES = [
  0,
  1,
  2,
  3,
  4,
  5,
] as const;

function DiceRoller() {
  const { state: gameState, dispatch } = useGame();
  const shouldReduceMotion = useReducedMotion();
  const [rolling, setRolling] = useState(false);
  const [selectedSyllable, setSelectedSyllable] = useState('');
  const [orientation, setOrientation] = useState<DiceOrientation>(getFaceOrientation(0));
  const [rollProfile, setRollProfile] = useState<DiceRollProfile | null>(null);
  const timerRef = useRef<number | null>(null);

  const isDisabled = gameState.currentSyllable !== null || rolling;

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleRoll = useCallback(() => {
    if (isDisabled) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * FACE_SYLLABLES.length);
    const syllable = FACE_SYLLABLES[randomIndex];
    const faceIndex = FACE_CLASSES[randomIndex];
    const nextOrientation = getFaceOrientation(faceIndex);

    if (shouldReduceMotion) {
      setOrientation(nextOrientation);
      setSelectedSyllable(syllable);
      dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: 'start' } });
      return;
    }

    const profile = createDiceRollProfile(orientation, nextOrientation, DICE_DURATION_MS);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setRollProfile(profile);
    setRolling(true);
    setSelectedSyllable('');

    timerRef.current = window.setTimeout(() => {
      setOrientation(nextOrientation);
      setSelectedSyllable(syllable);
      dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: 'start' } });
      setRolling(false);
      setRollProfile(null);
      timerRef.current = null;
    }, profile.durationMs);
  }, [isDisabled, shouldReduceMotion, dispatch, orientation]);

  return (
    <div className={styles.wrapper}>
      <DiceCube3D
        faces={[...FACE_SYLLABLES]}
        orientation={orientation}
        rolling={rolling}
        disabled={isDisabled}
        rollProfile={rollProfile}
        label={
          rolling
            ? 'Lanzando dado...'
            : selectedSyllable
              ? `Sílaba: ${selectedSyllable}`
              : 'Dado silábico'
        }
        onRoll={handleRoll}
      />

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
