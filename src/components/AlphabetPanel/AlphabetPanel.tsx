import { motion, useReducedMotion } from 'framer-motion';
import { LetterTile } from '../LetterTile/LetterTile';
import styles from './AlphabetPanel.module.css';

const SPANISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
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

const letterVariants = {
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
