import { describe, it, expect } from 'vitest';
import { createDictionaryService } from './dictionaryService';
import type { SyllableData } from '../types/dictionary';
import dictionaryData from '../data/dictionary.json';

const service = createDictionaryService(dictionaryData as SyllableData[]);

describe('dictionaryService', () => {
  describe('isValidWord', () => {
    it('returns true for an existing word', () => {
      expect(service.isValidWord('mama')).toBe(true);
    });

    it('returns false for a non-existing word', () => {
      expect(service.isValidWord('zzzzz')).toBe(false);
    });

    it('is case-insensitive', () => {
      expect(service.isValidWord('MAMA')).toBe(true);
      expect(service.isValidWord('Mama')).toBe(true);
    });
  });

  describe('getWordsForSyllable', () => {
    it('returns a non-empty array for an existing syllable', () => {
      const words = service.getWordsForSyllable('ma');
      expect(words.length).toBeGreaterThan(0);
      expect(words[0]).toHaveProperty('word');
      expect(words[0]).toHaveProperty('difficulty');
    });

    it('returns an empty array for a non-existing syllable', () => {
      expect(service.getWordsForSyllable('zz')).toEqual([]);
    });

    it('is case-insensitive', () => {
      const words = service.getWordsForSyllable('MA');
      expect(words.length).toBeGreaterThan(0);
    });
  });

  describe('getClosestMatch', () => {
    it('returns a match when partial is a prefix of a valid word', () => {
      const match = service.getClosestMatch('mam', 'ma');
      expect(match).not.toBeNull();
      expect(match!.word).toBe('mama');
    });

    it('returns null when there is no match', () => {
      const match = service.getClosestMatch('xyz', 'ma');
      expect(match).toBeNull();
    });

    it('returns null for a non-existing syllable', () => {
      const match = service.getClosestMatch('mam', 'zz');
      expect(match).toBeNull();
    });
  });

  describe('getRandomSyllable', () => {
    it('returns a CV syllable for world selva', () => {
      const result = service.getRandomSyllable('selva');
      expect(typeof result.syllable).toBe('string');
      expect(result.syllable.length).toBeGreaterThanOrEqual(2);
      expect(result.position).toMatch(/^(start|end)$/);
    });

    it('throws for a world with no syllables', () => {
      expect(() => service.getRandomSyllable('granja')).toThrow(
        'No syllables found for world: granja',
      );
    });
  });

  describe('dictionary data integrity', () => {
    it('contains at least 50 unique words', () => {
      const allWords = new Set<string>();
      for (const entry of dictionaryData as SyllableData[]) {
        for (const w of entry.words) {
          allWords.add(w.word.toLowerCase());
        }
      }
      expect(allWords.size).toBeGreaterThanOrEqual(50);
    });

    it('every syllable has at least 2 words', () => {
      for (const entry of dictionaryData as SyllableData[]) {
        expect(
          entry.words.length,
          `Syllable "${entry.syllable}" (${entry.syllablePosition ?? 'start'}) has fewer than 2 words`,
        ).toBeGreaterThanOrEqual(2);
      }
    });
  });
});
