import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { DictionaryEntry } from '../../types/dictionary';
import styles from './VisualHint.module.css';

interface VisualHintProps {
  match: DictionaryEntry | null;
}

const HINT_ICONS: Record<string, string> = {
  mama: '👩',
  papa: '👨',
  casa: '🏠',
  sapo: '🐸',
  pato: '🦆',
  lago: '🏞️',
  lobo: '🐺',
  toro: '🐂',
  rana: '🐸',
  sopa: '🍲',
  coco: '🥥',
  rosa: '🌹',
  ropa: '👕',
  taza: '☕',
  cama: '🛏️',
  lana: '🧶',
  mano: '✋',
  pala: '⛏️',
  rama: '🌿',
  copa: '🏆',
  nota: '🎵',
  nave: '🚀',
  mapa: '🗺️',
  cola: '🦊',
  roca: '🪨',
  topo: '🐀',
  loco: '🤪',
};

const DEFAULT_ICON = '💡';

function VisualHint({ match }: VisualHintProps) {
  const shouldReduceMotion = useReducedMotion();

  const icon = match
    ? HINT_ICONS[match.word.toLowerCase()] ?? DEFAULT_ICON
    : null;

  return (
    <AnimatePresence>
      {icon && (
        <motion.div
          className={styles.hint}
          role="status"
          aria-label="Pista visual"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.3, y: 10 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: -10 }}
          transition={shouldReduceMotion ? { duration: 0 } : {
            type: 'spring',
            stiffness: 400,
            damping: 15,
            mass: 0.8,
          }}
        >
          <motion.span
            className={styles.icon}
            aria-hidden="true"
            animate={shouldReduceMotion ? {} : {
              rotate: [0, -5, 5, -3, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          >
            {icon}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { VisualHint };
