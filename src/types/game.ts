import type { WorldId } from './dictionary';

export interface PlacedLetter {
  letter: string;
  position: number;
}

export interface GameState {
  currentSyllable: string | null;
  placedLetters: PlacedLetter[];
  completedWords: string[];
  round: number;
  selectedWorld: WorldId;
  isSessionActive: boolean;
}

export type GameAction =
  | { type: 'START_SESSION'; payload: WorldId }
  | { type: 'SET_SYLLABLE'; payload: string }
  | { type: 'ADD_LETTER'; payload: PlacedLetter }
  | { type: 'REMOVE_LETTER'; payload: number }
  | { type: 'COMPLETE_WORD'; payload: string }
  | { type: 'RESET_ROUND' }
  | { type: 'END_SESSION' };
