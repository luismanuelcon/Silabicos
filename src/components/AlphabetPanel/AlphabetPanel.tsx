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

function AlphabetPanel({ onLetterDragStart, onLetterDragEnd }: AlphabetPanelProps) {
  return (
    <div className={styles.panel} role="group" aria-label="Panel de letras">
      {SPANISH_ALPHABET.map((letter) => (
        <LetterTile
          key={letter}
          letter={letter}
          onDragStart={onLetterDragStart}
          onDragEnd={onLetterDragEnd}
        />
      ))}
    </div>
  );
}

export { AlphabetPanel, SPANISH_ALPHABET };
