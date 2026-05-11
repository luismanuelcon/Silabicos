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
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { VisualHint };
