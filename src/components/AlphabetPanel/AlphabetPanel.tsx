import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { LetterTile } from '../LetterTile/LetterTile';
import styles from './AlphabetPanel.module.css';

const SPANISH_ALPHABET = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's',
  't', 'u', 'v', 'w', 'x', 'y', 'z',
];

interface AlphabetPanelProps {
  onLetterDragStart?: (letter: string) => void;
  onLetterDragEnd?: (letter: string, x: number, y: number) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

function AlphabetPanel({ onLetterDragStart, onLetterDragEnd }: AlphabetPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.panel}
      role="group"
      aria-label="Panel de letras"
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
    >
      {SPANISH_ALPHABET.map((letter) => (
        <motion.div key={letter} variants={shouldReduceMotion ? undefined : letterVariants}>
          <LetterTile
            letter={letter}
            onDragStart={onLetterDragStart}
            onDragEnd={onLetterDragEnd}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AlphabetPanel, SPANISH_ALPHABET };
