import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  DiceCube3D,
  createDiceRollProfile,
  getFaceOrientation,
  type DiceOrientation,
  type DiceRollProfile,
} from '../DiceCube3D';
import styles from './SilabcDice.module.css';

interface DiceState {
  rolling: boolean;
  selectedSyllable: string;
  orientation: DiceOrientation;
  rollProfile: DiceRollProfile | null;
}

export interface SilabcDiceResult {
  diceIndex: number;
  syllable: string;
}

interface SilabcDiceProps {
  syllables?: string[];
  diceCount?: number;
  rollDurationMs?: number;
  resultSelected?: (syllable: string) => void;
  resultsSelected?: (syllables: string[]) => void;
  diceResultSelected?: (result: SilabcDiceResult) => void;
}

const FACE_CLASSES = [
  0,
  1,
  2,
  3,
  4,
  5,
] as const;

function normalizeSyllables(source?: string[]): string[] {
  const fallback = ['sa', 'se', 'si', 'so', 'su', 'la'];
  const safe = (source ?? [])
    .map((item) => (item ?? '').trim().toLowerCase())
    .filter((item) => item.length > 0)
    .slice(0, 6);

  while (safe.length < 6) {
    safe.push(fallback[safe.length]);
  }

  return safe;
}

function SilabcDice({
  syllables,
  diceCount = 1,
  rollDurationMs = 900,
  resultSelected,
  resultsSelected,
  diceResultSelected,
}: SilabcDiceProps) {
  const shouldReduceMotion = useReducedMotion();
  const normalizedSyllables = useMemo(() => normalizeSyllables(syllables), [syllables]);

  const safeDiceCount = Math.max(1, Math.floor(diceCount));
  const [diceStates, setDiceStates] = useState<DiceState[]>(() =>
    Array.from({ length: safeDiceCount }, () => ({
      rolling: false,
      selectedSyllable: '',
      orientation: getFaceOrientation(0),
      rollProfile: null,
    })),
  );
  const timeoutByDiceRef = useRef<Record<number, number>>({});

  useEffect(() => {
    return () => {
      Object.values(timeoutByDiceRef.current).forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutByDiceRef.current = {};
    };
  }, []);

  useEffect(() => {
    setDiceStates((previous) =>
      Array.from({ length: safeDiceCount }, (_, index) => {
        const current = previous[index];
        return (
          current ?? {
            rolling: false,
            selectedSyllable: '',
            orientation: getFaceOrientation(0),
            rollProfile: null,
          }
        );
      }),
    );
  }, [safeDiceCount]);

  function emitAggregatedIfReady(nextStates: DiceState[]) {
    if (safeDiceCount === 1) {
      const syllable = nextStates[0]?.selectedSyllable;
      if (syllable && resultSelected) {
        resultSelected(syllable);
      }
      return;
    }

    const hasRolling = nextStates.some((state) => state.rolling);
    const allSelected = nextStates.every((state) => state.selectedSyllable.length > 0);

    if (!hasRolling && allSelected && resultsSelected) {
      resultsSelected(nextStates.map((state) => state.selectedSyllable));
    }
  }

  function rollSingleDice(diceIndex: number) {
    const currentState = diceStates[diceIndex];
    if (!currentState || currentState.rolling) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * normalizedSyllables.length);
    const syllable = normalizedSyllables[randomIndex];
    const faceIndex = FACE_CLASSES[randomIndex];
    const targetOrientation = getFaceOrientation(faceIndex);

    if (shouldReduceMotion) {
      setDiceStates((previous) => {
        const updated = [...previous];
        const current = updated[diceIndex];
        if (!current) {
          return previous;
        }
        updated[diceIndex] = {
          ...current,
          rolling: false,
          selectedSyllable: syllable.toUpperCase(),
          orientation: targetOrientation,
          rollProfile: null,
        };

        diceResultSelected?.({ diceIndex, syllable: syllable.toUpperCase() });
        emitAggregatedIfReady(updated);
        return updated;
      });
      return;
    }

    const profile = createDiceRollProfile(currentState.orientation, targetOrientation, rollDurationMs);

    setDiceStates((previous) => {
      const updated = [...previous];
      const current = updated[diceIndex];
      if (!current) {
        return previous;
      }

      updated[diceIndex] = {
        ...current,
        rolling: true,
        selectedSyllable: '',
        rollProfile: profile,
      };

      return updated;
    });

    if (timeoutByDiceRef.current[diceIndex]) {
      clearTimeout(timeoutByDiceRef.current[diceIndex]);
      delete timeoutByDiceRef.current[diceIndex];
    }

    timeoutByDiceRef.current[diceIndex] = window.setTimeout(() => {
      setDiceStates((previous) => {
        const updated = [...previous];
        const current = updated[diceIndex];
        if (!current) {
          return previous;
        }

        updated[diceIndex] = {
          ...current,
          rolling: false,
          selectedSyllable: syllable.toUpperCase(),
          orientation: targetOrientation,
          rollProfile: null,
        };

        diceResultSelected?.({ diceIndex, syllable: syllable.toUpperCase() });
        emitAggregatedIfReady(updated);
        return updated;
      });
      delete timeoutByDiceRef.current[diceIndex];
    }, profile.durationMs);
  }

  function rollDice(diceIndex?: number) {
    if (typeof diceIndex === 'number') {
      rollSingleDice(diceIndex);
      return;
    }

    if (safeDiceCount > 1) {
      for (let i = 0; i < safeDiceCount; i += 1) {
        rollSingleDice(i);
      }
      return;
    }

    rollSingleDice(0);
  }

  function isRolling(index: number): boolean {
    return diceStates[index]?.rolling ?? false;
  }

  const hasRollingDice = diceStates.some((state) => state.rolling);

  return (
    <div className={styles.wrapper}>
      <div className={styles.diceGrid} style={{ ['--dice-count' as string]: safeDiceCount }}>
        {diceStates.map((state, index) => (
          <div key={index} className={styles.diceCard}>
            <div className={styles.scene}>
              <DiceCube3D
                faces={normalizedSyllables}
                orientation={state.orientation}
                rolling={state.rolling}
                disabled={state.rolling}
                rollProfile={state.rollProfile}
                label={state.selectedSyllable ? `Sílaba: ${state.selectedSyllable}` : 'Dado silábico'}
                onRoll={() => rollDice(index)}
              />
            </div>

            {safeDiceCount > 1 && (
              <button
                type="button"
                className={`${styles.rollButton} ${styles.rollButtonSmall}`}
                onClick={() => rollDice(index)}
                disabled={isRolling(index)}
              >
                {isRolling(index) ? 'Girando...' : `Tirar dado ${index + 1}`}
              </button>
            )}

            <div className={styles.result}>
              {state.selectedSyllable ? `Resultado: ${state.selectedSyllable}` : ''}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={styles.rollButton} onClick={() => rollDice()} disabled={hasRollingDice}>
        {hasRollingDice ? 'Girando...' : safeDiceCount > 1 ? 'Tirar todos' : 'Tirar dado'}
      </button>
    </div>
  );
}

export { SilabcDice };
