import { useCallback, useEffect, useState } from 'react';
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

const SESSION_DURATION_SECONDS = 180;

function GameplayScreen() {
  const { state: playerState, dispatch: playerDispatch } = usePlayer();
  const { state: gameState, dispatch } = useGame();
  const { dispatch: navDispatch } = useNavigation();
  const { currentWord, isValid, closestMatch } = useWordValidation();
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

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
      if (!gameState.currentSyllable) return;

      const afterLetters = gameState.placedLetters.filter(
        (l) => l.position >= 0,
      );
      const nextPosition = afterLetters.length;

      dispatch({
        type: 'ADD_LETTER',
        payload: { letter: letter.toLowerCase(), position: nextPosition },
      });
    },
    [gameState.currentSyllable, gameState.placedLetters, dispatch],
  );

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.avatarBadge} aria-label="Tu avatar">
          <span className={styles.avatarEmoji}>{avatarEmoji}</span>
          {playerState.name && (
            <span className={styles.playerName}>{playerState.name}</span>
          )}
        </div>
        <div className={styles.worldBadge}>
          🌴 Selva — Ronda {gameState.round + 1}
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
          <WordBuilder />
          {!celebrating && !sessionEnded && closestMatch && (
            <VisualHint match={closestMatch} />
          )}
        </div>
      </section>

      {gameState.currentSyllable && !celebrating && !sessionEnded && (
        <AlphabetPanel onLetterDragEnd={handleLetterDragEnd} />
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
