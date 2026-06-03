import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useDictionary } from '../../contexts/DictionaryContext';
import {
  DiceCube3D,
  createDiceRollProfile,
  getFaceOrientation,
  type DiceRollProfile,
  type DiceOrientation,
} from '../DiceCube3D';
import styles from './DiceRoller.module.css';

const DICE_DURATION_MS = 2500;

const FALLBACK_FACES = [
  { syllable: 'ma', position: 'start' as const },
  { syllable: 'pa', position: 'start' as const },
  { syllable: 'sa', position: 'start' as const },
  { syllable: 'la', position: 'start' as const },
  { syllable: 'ca', position: 'start' as const },
  { syllable: 'ta', position: 'start' as const },
];

function DiceRoller() {
  const { state: gameState, dispatch } = useGame();
  const dictionary = useDictionary();
  const shouldReduceMotion = useReducedMotion();
  const [rolling, setRolling] = useState(false);
  const [selectedSyllable, setSelectedSyllable] = useState('');
  const [winnerFaceIndex, setWinnerFaceIndex] = useState<number | null>(null);
  const [orientation, setOrientation] = useState<DiceOrientation>(getFaceOrientation(0));
  const [rollProfile, setRollProfile] = useState<DiceRollProfile | null>(null);
  const timerRef = useRef<number | null>(null);

  const worldFaces = useMemo(() => {
    const syllables = dictionary.getSyllablesForWorld(gameState.selectedWorld);
    const unique: Array<{ syllable: string; position: 'start' | 'end' }> = [];
    const seen = new Set<string>();

    for (const item of syllables) {
      const key = `${item.syllable}:${item.position}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      unique.push({ syllable: item.syllable, position: item.position });
      if (unique.length === 6) {
        break;
      }
    }

    while (unique.length < 6) {
      unique.push(FALLBACK_FACES[unique.length]);
    }

    return unique;
  }, [dictionary, gameState.selectedWorld]);

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

    const randomIndex = Math.floor(Math.random() * worldFaces.length);
    const selectedFace = worldFaces[randomIndex];
    const syllable = selectedFace.syllable;
    const syllablePosition = selectedFace.position;
    const faceIndex = randomIndex;
    const nextOrientation = getFaceOrientation(faceIndex);

    if (shouldReduceMotion) {
      setOrientation(nextOrientation);
      setSelectedSyllable(syllable);
      setWinnerFaceIndex(faceIndex);
      dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: syllablePosition } });
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
    setWinnerFaceIndex(null);

    timerRef.current = window.setTimeout(() => {
      setOrientation(nextOrientation);
      setSelectedSyllable(syllable);
      setWinnerFaceIndex(faceIndex);
      dispatch({ type: 'SET_SYLLABLE', payload: { syllable, position: syllablePosition } });
      setRolling(false);
      setRollProfile(null);
      timerRef.current = null;
    }, profile.durationMs);
  }, [isDisabled, shouldReduceMotion, dispatch, orientation, worldFaces]);

  return (
    <div className={styles.wrapper}>
      <DiceCube3D
        faces={worldFaces.map((entry) => entry.syllable)}
        orientation={orientation}
        rolling={rolling}
        disabled={isDisabled}
        winnerFaceIndex={winnerFaceIndex}
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

      {selectedSyllable && (
        <div className={styles.result} role="status" aria-live="polite">
          Silaba ganadora: <strong>{selectedSyllable.toUpperCase()}</strong>
        </div>
      )}
    </div>
  );
}

export { DiceRoller };
