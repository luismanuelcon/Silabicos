import type { SyllablePosition } from './game';

export type WorldId = 'selva' | 'granja' | 'oceano';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DictionaryEntry {
  word: string;
  difficulty: Difficulty;
  imageHint?: string;
}

export interface SyllableData {
  syllable: string;
  world: WorldId;
  syllablePosition?: SyllablePosition;
  words: DictionaryEntry[];
}

export interface SyllableResult {
  syllable: string;
  position: SyllablePosition;
}

export interface DictionaryService {
  getWordsForSyllable(syllable: string, position?: SyllablePosition): DictionaryEntry[];
  isValidWord(word: string): boolean;
  getClosestMatch(
    partial: string,
    syllable: string,
    position?: SyllablePosition,
  ): DictionaryEntry | null;
  getRandomSyllable(world: WorldId): SyllableResult;
}
