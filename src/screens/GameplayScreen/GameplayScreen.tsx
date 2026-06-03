import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useGame } from '../../contexts/GameContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useWordValidation } from '../../hooks/useWordValidation';
import { DiceRoller } from '../../components/DiceRoller/DiceRoller';
import { WordBuilder } from '../../components/WordBuilder/WordBuilder';
import { AlphabetPanel } from '../../components/AlphabetPanel/AlphabetPanel';
import { Celebration } from '../../components/Celebration/Celebration';
import { VisualHint } from '../../components/VisualHint/VisualHint';
import { SessionTimer } from '../../components/SessionTimer/SessionTimer';
import styles from './GameplayScreen.module.css';

const AVATAR_LABELS: Record<string, string> = {
  mono: '🐵',
  loro: '🦜',
  rana: '🐸',
};

const WORLD_LABELS = {
  selva: 'Selva',
  granja: 'Granja',
  oceano: 'Océano',
} as const;

const WORLD_EMOJIS = {
  selva: '🌴',
  granja: '🌾',
  oceano: '🌊',
} as const;

const SESSION_DURATION_SECONDS = 180;

function GameplayScreen() {
  const { state: playerState, dispatch: playerDispatch } = usePlayer();
  const { state: gameState, dispatch } = useGame();
  const { dispatch: navDispatch } = useNavigation();
  const { currentWord, isValid, closestMatch } = useWordValidation();
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const avatarEmoji = playerState.avatarId
    ? AVATAR_LABELS[playerState.avatarId]
    : '🐾';

  // Auto-trigger celebration when word is valid
  useEffect(() => {
    if (isValid && !celebrating) {
      setCelebrating(currentWord);
      dispatch({ type: 'COMPLETE_WORD', payload: currentWord });
      playerDispatch({ type: 'ADD_COMPLETED_WORD', payload: currentWord });
    }
  }, [isValid, currentWord, celebrating, dispatch, playerDispatch]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrating(null);
  }, []);

  const handleTimeUp = useCallback(() => {
    setSessionEnded(true);
  }, []);

  const handleSessionEndCelebrationComplete = useCallback(() => {
    dispatch({ type: 'END_SESSION' });
    navDispatch({ type: 'NAVIGATE_TO', payload: 'summary' });
  }, [dispatch, navDispatch]);

  const handleLetterDragEnd = useCallback(
    (letter: string) => {
      setIsDragging(false);
      if (!gameState.currentSyllable) return;

      let nextPosition: number;

      if (gameState.syllablePosition === 'end') {
        // Syllable is at end → letters go before (negative positions, left-to-right)
        const beforeLetters = gameState.placedLetters.filter(
          (l) => l.position < 0,
        );
        // Fill from -MAX down to -1: first letter = -2, second = -1 (for 2 slots)
        nextPosition = -(2 - beforeLetters.length);
      } else {
        // Syllable is at start → letters go after (positions 0, 1, 2...)
        const afterLetters = gameState.placedLetters.filter(
          (l) => l.position >= 0,
        );
        nextPosition = afterLetters.length;
      }

      dispatch({
        type: 'ADD_LETTER',
        payload: { letter: letter.toLowerCase(), position: nextPosition },
      });
    },
    [gameState.currentSyllable, gameState.placedLetters, gameState.syllablePosition, dispatch],
  );

  const handleLetterDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div className={styles.screen}>
      {/* Atmospheric jungle elements */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={`${styles.vine} ${styles.vineLeft}`}>
          <div className={styles.vineLeaf} style={{ width: 8, height: 8, bottom: 16, left: 8 }} />
          <div className={styles.vineLeaf} style={{ width: 12, height: 12, bottom: 60, left: 2, opacity: 0.6 }} />
        </div>
        <div className={`${styles.vine} ${styles.vineRight}`}>
          <div className={styles.vineLeaf} style={{ width: 10, height: 10, bottom: 40, right: 2, opacity: 0.5 }} />
        </div>
        <div className={styles.flowerLeft}>🌸</div>
        <div className={styles.flowerRight}>🌺</div>
        <div className={styles.leafDecor}>🌿</div>
      </div>

      <header className={styles.header}>
        <motion.div
          className={styles.avatarBadge}
          aria-label="Tu avatar"
          animate={
            celebrating && !shouldReduceMotion
              ? { y: [0, -8, 0, -5, 0], rotate: [0, -5, 5, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={
            celebrating
              ? { duration: 0.6, repeat: Infinity, repeatDelay: 0.3 }
              : { duration: 0.3 }
          }
        >
          <span className={styles.avatarEmoji}>{avatarEmoji}</span>
          {playerState.name && (
            <span className={styles.playerName}>{playerState.name}</span>
          )}
        </motion.div>
        <div className={styles.worldBadge}>
          {WORLD_EMOJIS[gameState.selectedWorld]} {WORLD_LABELS[gameState.selectedWorld]} — Ronda {gameState.round + 1}
        </div>
      </header>

      <SessionTimer
        durationSeconds={SESSION_DURATION_SECONDS}
        active={gameState.isSessionActive && !sessionEnded}
        onTimeUp={handleTimeUp}
      />

      <section className={styles.gameZone}>
        <DiceRoller />
        <div className={styles.buildColumn}>
          <WordBuilder isDragging={isDragging} />

          {!celebrating && !sessionEnded && closestMatch && (
            <VisualHint match={closestMatch} />
          )}
        </div>
      </section>

      {gameState.currentSyllable && !celebrating && !sessionEnded && (
        <AlphabetPanel
          onLetterDragStart={handleLetterDragStart}
          onLetterDragEnd={handleLetterDragEnd}
        />
      )}

      {celebrating && !sessionEnded && (
        <Celebration
          word={celebrating}
          onComplete={handleCelebrationComplete}
        />
      )}

      {sessionEnded && (
        <Celebration
          word=""
          variant="session-end"
          wordsCount={gameState.completedWords.length}
          onComplete={handleSessionEndCelebrationComplete}
        />
      )}
    </div>
  );
}

export { GameplayScreen };
