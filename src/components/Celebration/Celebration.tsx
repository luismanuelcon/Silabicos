import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './Celebration.module.css';

type CelebrationVariant = 'word-complete' | 'session-end';

interface CelebrationProps {
  word: string;
  onComplete: () => void;
  variant?: CelebrationVariant;
  wordsCount?: number;
}

const CELEBRATION_DURATION = 2500;
const SESSION_END_DURATION = 3500;

const CONFETTI_SETS = [
  ['🎉', '⭐', '🌟', '✨', '🎊', '💫', '🌈', '🎶', '🎈', '🍭'],
  ['🎆', '🎇', '🏆', '🌟', '🎉', '✨', '🥳', '💫', '🎊', '⭐'],
  ['🦋', '🌸', '💐', '🌺', '✨', '⭐', '🎉', '💫', '🌟', '🎊'],
  ['🚀', '⭐', '🌟', '💫', '✨', '🎉', '🎊', '🎈', '🌈', '🎶'],
];

const CELEBRATION_COLORS = ['#ae2f34', '#006a65', '#ff6b6b', '#79f3ea', '#5952af', '#ffb3b0'];

function Celebration({ word, onComplete, variant = 'word-complete', wordsCount }: CelebrationProps) {
  const shouldReduceMotion = useReducedMotion();
  const isSessionEnd = variant === 'session-end';
  const duration = isSessionEnd ? SESSION_END_DURATION : CELEBRATION_DURATION;

  // Pick a random celebration set per render
  const confettiSet = useMemo(
    () => CONFETTI_SETS[Math.floor(Math.random() * CONFETTI_SETS.length)],
    [],
  );

  // Generate many particles (mix of emojis and colored circles)
  const particles = useMemo(() => {
    const count = isSessionEnd ? 70 : 50;
    return Array.from({ length: count }).map((_, i) => {
      const isEmoji = Math.random() > 0.4;
      const angle = (Math.random() * Math.PI * 2);
      const distance = 80 + Math.random() * 250;
      return {
        id: i,
        isEmoji,
        emoji: confettiSet[i % confettiSet.length],
        color: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 100,
        rotate: (Math.random() - 0.5) * 720,
        scale: 0.8 + Math.random() * 0.8,
        delay: i * 0.03,
      };
    });
  }, [confettiSet, isSessionEnd]);

  useEffect(() => {
    const timeout = setTimeout(
      onComplete,
      shouldReduceMotion ? 500 : duration,
    );
    return () => clearTimeout(timeout);
  }, [onComplete, shouldReduceMotion, duration]);

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
        {/* Decorative stars */}
        <motion.div
          className={`${styles.stars} ${styles.starLeft}`}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          aria-hidden="true"
        >
          🌟
        </motion.div>
        <motion.div
          className={`${styles.stars} ${styles.starRight}`}
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          aria-hidden="true"
        >
          ⭐
        </motion.div>

        {/* Confetti particles - exploding from center */}
        <div className={styles.confettiContainer} aria-hidden="true">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className={styles.confetti}
              style={
                p.isEmoji
                  ? { fontSize: `${16 + p.scale * 12}px` }
                  : {
                      width: `${8 + p.scale * 10}px`,
                      height: `${8 + p.scale * 10}px`,
                      backgroundColor: p.color,
                      borderRadius: Math.random() > 0.5 ? '50%' : '20%',
                      display: 'block',
                    }
              }
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, p.scale * 1.5, p.scale, 0],
                x: p.x,
                y: p.y,
                rotate: p.rotate,
              }}
              transition={{
                duration: 1.8,
                delay: p.delay,
                ease: [0.1, 0.8, 0.4, 1],
              }}
            >
              {p.isEmoji ? p.emoji : null}
            </motion.span>
          ))}
        </div>

        {/* Avatar celebration */}
        <motion.div
          className={styles.avatarCelebrate}
          initial={{ scale: 0, y: 50 }}
          animate={{
            scale: 1,
            y: [0, -30, 0, -30, 0],
            rotate: [0, -5, 0, 5, 0],
          }}
          transition={{
            scale: { delay: 0.3, type: 'spring', stiffness: 300, damping: 12 },
            y: { delay: 0.5, duration: 1.5, ease: 'easeInOut' },
            rotate: { delay: 0.5, duration: 1.5, ease: 'easeInOut' },
          }}
          aria-hidden="true"
        >
          🐵
        </motion.div>

        {/* Word reveal with bounce overshoot */}
        <motion.div
          className={styles.wordReveal}
          initial={{ scale: 0, y: 40, rotate: -5 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 12,
            delay: 0.15,
          }}
        >
          {displayText}
        </motion.div>

        {/* Flash effect */}
        <motion.div
          className={styles.flash}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export { Celebration };
