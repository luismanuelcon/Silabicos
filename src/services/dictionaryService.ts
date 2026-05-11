import type {
  DictionaryEntry,
  DictionaryService,
  SyllableData,
  WorldId,
} from '../types/dictionary';

function createDictionaryService(data: SyllableData[]): DictionaryService {
  const syllableMap = new Map<string, DictionaryEntry[]>();
  const wordSet = new Set<string>();
  const worldSyllables = new Map<WorldId, string[]>();

  for (const entry of data) {
    const key = entry.syllable.toLowerCase();
    syllableMap.set(key, entry.words);

    for (const w of entry.words) {
      wordSet.add(w.word.toLowerCase());
    }

    const existing = worldSyllables.get(entry.world) ?? [];
    existing.push(key);
    worldSyllables.set(entry.world, existing);
  }

  function isValidWord(word: string): boolean {
    return wordSet.has(word.toLowerCase());
  }

  function getWordsForSyllable(syllable: string): DictionaryEntry[] {
    return syllableMap.get(syllable.toLowerCase()) ?? [];
  }

  function getClosestMatch(
    partial: string,
    syllable: string,
  ): DictionaryEntry | null {
    const words = getWordsForSyllable(syllable);
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

  function getRandomSyllable(world: WorldId): string {
    const syllables = worldSyllables.get(world);
    if (!syllables || syllables.length === 0) {
      throw new Error(`No syllables found for world: ${world}`);
    }
    const index = Math.floor(Math.random() * syllables.length);
    return syllables[index];
  }

  return {
    isValidWord,
    getWordsForSyllable,
    getClosestMatch,
    getRandomSyllable,
  };
}

export { createDictionaryService };
