import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from './SilabcDice.module.css';

interface DiceState {
  rolling: boolean;
  selectedSyllable: string;
  rotationClass: string;
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
  'showFront',
  'showBack',
  'showRight',
  'showLeft',
  'showTop',
  'showBottom',
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
      rotationClass: styles.showFront,
    })),
  );

  useEffect(() => {
    setDiceStates((previous) =>
      Array.from({ length: safeDiceCount }, (_, index) => {
        const current = previous[index];
        return (
          current ?? {
            rolling: false,
            selectedSyllable: '',
            rotationClass: styles.showFront,
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
    setDiceStates((previous) => {
      const current = previous[diceIndex];
      if (!current || current.rolling) {
        return previous;
      }

      const updated = [...previous];
      updated[diceIndex] = {
        ...current,
        rolling: true,
        selectedSyllable: '',
      };
      return updated;
    });

    const randomIndex = Math.floor(Math.random() * normalizedSyllables.length);
    const syllable = normalizedSyllables[randomIndex];
    const rotationClass = styles[FACE_CLASSES[randomIndex]];

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
          rotationClass,
        };

        diceResultSelected?.({ diceIndex, syllable: syllable.toUpperCase() });
        emitAggregatedIfReady(updated);
        return updated;
      });
      return;
    }

    setTimeout(() => {
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
          rotationClass,
        };

        diceResultSelected?.({ diceIndex, syllable: syllable.toUpperCase() });
        emitAggregatedIfReady(updated);
        return updated;
      });
    }, rollDurationMs);
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
              <div
                className={[
                  styles.dice,
                  state.rotationClass,
                  state.rolling ? styles.rolling : '',
                ].filter(Boolean).join(' ')}
                role="button"
                tabIndex={state.rolling ? -1 : 0}
                aria-disabled={state.rolling}
                aria-label={state.selectedSyllable ? `Sílaba: ${state.selectedSyllable}` : 'Dado silábico'}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    rollDice(index);
                  }
                }}
                onClick={() => rollDice(index)}
              >
                <div className={styles.faceLight} aria-hidden="true" />
                <div className={`${styles.face} ${styles.faceFront}`}>{normalizedSyllables[0]}</div>
                <div className={`${styles.face} ${styles.faceBack}`}>{normalizedSyllables[1]}</div>
                <div className={`${styles.face} ${styles.faceRight}`}>{normalizedSyllables[2]}</div>
                <div className={`${styles.face} ${styles.faceLeft}`}>{normalizedSyllables[3]}</div>
                <div className={`${styles.face} ${styles.faceTop}`}>{normalizedSyllables[4]}</div>
                <div className={`${styles.face} ${styles.faceBottom}`}>{normalizedSyllables[5]}</div>
              </div>
              <div className={`${styles.shadow} ${state.rolling ? styles.shadowRolling : ''}`} aria-hidden="true" />
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
