import type {
  DictionaryEntry,
  DictionaryService,
  SyllableData,
  SyllableResult,
  WorldId,
} from '../types/dictionary';
import type { SyllablePosition } from '../types/game';

interface SyllableKey {
  syllable: string;
  position: SyllablePosition;
}

function makeSyllableKey(syllable: string, position: SyllablePosition): string {
  return `${syllable.toLowerCase()}:${position}`;
}

function createDictionaryService(data: SyllableData[]): DictionaryService {
  const syllableMap = new Map<string, DictionaryEntry[]>();
  const wordSet = new Set<string>();
  const worldSyllables = new Map<WorldId, SyllableKey[]>();

  for (const entry of data) {
    const position: SyllablePosition = entry.syllablePosition ?? 'start';
    const key = makeSyllableKey(entry.syllable, position);
    syllableMap.set(key, entry.words);

    for (const w of entry.words) {
      wordSet.add(w.word.toLowerCase());
    }

    const existing = worldSyllables.get(entry.world) ?? [];
    existing.push({ syllable: entry.syllable.toLowerCase(), position });
    worldSyllables.set(entry.world, existing);
  }

  function isValidWord(word: string): boolean {
    return wordSet.has(word.toLowerCase());
  }

  function getWordsForSyllable(syllable: string, position: SyllablePosition = 'start'): DictionaryEntry[] {
    return syllableMap.get(makeSyllableKey(syllable, position)) ?? [];
  }

  function getClosestMatch(
    partial: string,
    syllable: string,
    position: SyllablePosition = 'start',
  ): DictionaryEntry | null {
    const words = getWordsForSyllable(syllable, position);
    if (words.length === 0) return null;

    const lowerPartial = partial.toLowerCase();

    // Exact prefix match first
    const prefixMatch = words.find((w) =>
      w.word.toLowerCase().startsWith(lowerPartial),
    );
    if (prefixMatch) return prefixMatch;

    // Substring match
    const substringMatch = words.find((w) =>
      w.word.toLowerCase().includes(lowerPartial),
    );
    if (substringMatch) return substringMatch;

    return null;
  }

  function getRandomSyllable(world: WorldId): SyllableResult {
    const syllables = worldSyllables.get(world);
    if (!syllables || syllables.length === 0) {
      throw new Error(`No syllables found for world: ${world}`);
    }
    const index = Math.floor(Math.random() * syllables.length);
    const entry = syllables[index];
    return { syllable: entry.syllable, position: entry.position };
  }

  return {
    isValidWord,
    getWordsForSyllable,
    getClosestMatch,
    getRandomSyllable,
  };
}

export { createDictionaryService };
