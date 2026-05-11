import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './Celebration.module.css';

type CelebrationVariant = 'word-complete' | 'session-end';

interface CelebrationProps {
  word: string;
  onComplete: () => void;
  variant?: CelebrationVariant;
  wordsCount?: number;
}

const CELEBRATION_DURATION = 2000;
const SESSION_END_DURATION = 3000;

const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '✨', '🎊', '💫', '🌈', '🎶'];
const FIREWORKS_EMOJIS = ['🎆', '🎇', '🏆', '🌟', '🎉', '✨', '🥳', '💫', '🎊', '⭐'];

function Celebration({ word, onComplete, variant = 'word-complete', wordsCount }: CelebrationProps) {
  const shouldReduceMotion = useReducedMotion();
  const isSessionEnd = variant === 'session-end';
  const duration = isSessionEnd ? SESSION_END_DURATION : CELEBRATION_DURATION;

  useEffect(() => {
    const timeout = setTimeout(
      onComplete,
      shouldReduceMotion ? 500 : duration,
    );
    return () => clearTimeout(timeout);
  }, [onComplete, shouldReduceMotion, duration]);

  const emojis = isSessionEnd ? FIREWORKS_EMOJIS : CONFETTI_EMOJIS;
  const ariaLabel = isSessionEnd
    ? `¡Sesión terminada! Completaste ${wordsCount ?? 0} palabras`
    : `¡Muy bien! Formaste ${word}`;
  const displayText = isSessionEnd
    ? `🏆 ¡${wordsCount ?? 0} palabras!`
    : word.toUpperCase();

  if (shouldReduceMotion) {
    return (
      <div className={styles.overlay} role="alert" aria-label={ariaLabel}>
        <div className={styles.wordReveal}>{displayText}</div>
        <div className={styles.flash} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        role="alert"
        aria-label={ariaLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Confetti particles */}
        <div className={styles.confettiContainer} aria-hidden="true">
          {emojis.map((emoji, i) => (
            <motion.span
              key={i}
              className={styles.confetti}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                x: (i % 2 === 0 ? 1 : -1) * (40 + i * 20),
                y: -(60 + i * 15),
                rotate: (i % 2 === 0 ? 1 : -1) * 180,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        {/* Word reveal */}
        <motion.div
          className={styles.wordReveal}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.2,
          }}
        >
          {displayText}
        </motion.div>

        {/* Checkmark */}
        <motion.div
          className={styles.checkmark}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 12 }}
          aria-hidden="true"
        >
          ✅
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { Celebration };
