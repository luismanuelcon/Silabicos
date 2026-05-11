import { motion, useReducedMotion } from 'framer-motion';
import type { AvatarId } from '../../types/player';
import avatarMono from '../../assets/avatars/avatar-mono.svg';
import avatarLoro from '../../assets/avatars/avatar-loro.svg';
import avatarRana from '../../assets/avatars/avatar-rana.svg';
import styles from './AvatarCard.module.css';

interface AvatarCardProps {
  avatarId: AvatarId;
  selected: boolean;
  onSelect: (id: AvatarId) => void;
  celebrating: boolean;
}

const AVATAR_IMAGES: Record<AvatarId, string> = {
  mono: avatarMono,
  loro: avatarLoro,
  rana: avatarRana,
};

const AVATAR_LABELS: Record<AvatarId, string> = {
  mono: 'Seleccionar mono',
  loro: 'Seleccionar loro',
  rana: 'Seleccionar rana',
};

const celebrationVariants = {
  idle: { scale: 1, y: 0 },
  celebrating: {
    scale: [1, 1.2, 0.8, 1.1, 1],
    y: [0, -30, 0, -15, 0],
    transition: {
      duration: 1.5,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
};

const idleBreathVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
};

function AvatarCard({ avatarId, selected, onSelect, celebrating }: AvatarCardProps) {
  const shouldReduceMotion = useReducedMotion();

  function handleSelect() {
    if (!celebrating) {
      onSelect(avatarId);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  }

  const cardClassName = [
    styles.card,
    selected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={cardClassName}
      role="button"
      tabIndex={0}
      aria-label={AVATAR_LABELS[avatarId]}
      aria-pressed={selected}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      whileTap={shouldReduceMotion ? undefined : { scale: 1.08 }}
      transition={{ duration: 0.1 }}
      animate={
        celebrating && selected
          ? shouldReduceMotion
            ? celebrationVariants.idle
            : celebrationVariants.celebrating
          : undefined
      }
      data-testid={`avatar-${avatarId}`}
    >
      <motion.img
        src={AVATAR_IMAGES[avatarId]}
        alt={avatarId}
        className={styles.avatarImage}
        variants={shouldReduceMotion ? undefined : idleBreathVariants}
        initial="initial"
        animate={celebrating ? undefined : 'animate'}
      />
    </motion.div>
  );
}

export { AvatarCard };
