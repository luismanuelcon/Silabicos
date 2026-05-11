import { motion, useReducedMotion } from 'framer-motion';
import type { WorldId } from '../../types/dictionary';
import styles from './WorldCard.module.css';

interface WorldCardProps {
  worldId: WorldId;
  locked: boolean;
  onSelect: (worldId: WorldId) => void;
  label: string;
}

const WORLD_EMOJIS: Record<WorldId, string> = {
  selva: '🌴',
  granja: '🌾',
  oceano: '🌊',
};

const TAP_SCALE = [0.42, 0, 0.58, 1] as const;

function WorldCard({ worldId, locked, onSelect, label }: WorldCardProps) {
  const shouldReduceMotion = useReducedMotion();

  function handleSelect() {
    if (!locked) {
      onSelect(worldId);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!locked && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onSelect(worldId);
    }
  }

  const cardClass = [
    styles.card,
    styles[worldId],
    locked ? styles.locked : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={cardClass}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-label={locked ? `${label} — próximamente` : label}
      aria-disabled={locked}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      whileHover={locked || shouldReduceMotion ? undefined : { scale: 1.05 }}
      whileTap={
        locked || shouldReduceMotion
          ? undefined
          : { scale: 0.95, transition: { ease: [...TAP_SCALE] } }
      }
    >
      <span className={styles.emoji} aria-hidden="true">
        {locked ? '🔒' : WORLD_EMOJIS[worldId]}
      </span>
      <span className={styles.label}>{label}</span>
      {locked && (
        <span className={styles.comingSoon}>Próximamente</span>
      )}
    </motion.div>
  );
}

export { WorldCard };
