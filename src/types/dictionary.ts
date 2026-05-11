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
  words: DictionaryEntry[];
}

export interface DictionaryService {
  getWordsForSyllable(syllable: string): DictionaryEntry[];
  isValidWord(word: string): boolean;
  getClosestMatch(
    partial: string,
    syllable: string,
  ): DictionaryEntry | null;
  getRandomSyllable(world: WorldId): string;
}
