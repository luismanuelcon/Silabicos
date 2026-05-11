import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveProfile,
  loadProfile,
  saveCompletedWords,
  loadCompletedWords,
  clearStorage,
} from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveProfile / loadProfile', () => {
    it('saves and loads a profile', () => {
      saveProfile({ avatarId: 'mono', name: 'Luis', totalWordsCount: 5 });

      const profile = loadProfile();
      expect(profile).toEqual({
        avatarId: 'mono',
        name: 'Luis',
        totalWordsCount: 5,
      });
    });

    it('returns null when no profile exists', () => {
      expect(loadProfile()).toBeNull();
    });

    it('returns null for corrupted data', () => {
      localStorage.setItem('silabc_player_profile', 'not-json');
      expect(loadProfile()).toBeNull();
    });

    it('returns null for missing fields', () => {
      localStorage.setItem(
        'silabc_player_profile',
        JSON.stringify({ avatarId: 'mono' }),
      );
      expect(loadProfile()).toBeNull();
    });
  });

  describe('saveCompletedWords / loadCompletedWords', () => {
    it('saves and loads words', () => {
      saveCompletedWords(['mama', 'papa', 'casa']);
      expect(loadCompletedWords()).toEqual(['mama', 'papa', 'casa']);
    });

    it('trims to last 20 words', () => {
      const words = Array.from({ length: 25 }, (_, i) => `word${i}`);
      saveCompletedWords(words);

      const loaded = loadCompletedWords();
      expect(loaded).toHaveLength(20);
      expect(loaded[0]).toBe('word5');
      expect(loaded[19]).toBe('word24');
    });

    it('returns empty array when no words exist', () => {
      expect(loadCompletedWords()).toEqual([]);
    });

    it('returns empty array for corrupted data', () => {
      localStorage.setItem('silabc_completed_words', 'bad');
      expect(loadCompletedWords()).toEqual([]);
    });
  });

  describe('clearStorage', () => {
    it('removes all SILABC keys', () => {
      saveProfile({ avatarId: 'loro', name: 'Ana', totalWordsCount: 3 });
      saveCompletedWords(['mama']);

      clearStorage();

      expect(loadProfile()).toBeNull();
      expect(loadCompletedWords()).toEqual([]);
    });
  });

  describe('localStorage unavailable', () => {
    it('does not throw when localStorage is unavailable', () => {
      const original = globalThis.localStorage;
      Object.defineProperty(globalThis, 'localStorage', {
        get() {
          throw new Error('not available');
        },
        configurable: true,
      });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() =>
        saveProfile({ avatarId: 'mono', name: 'Test', totalWordsCount: 0 }),
      ).not.toThrow();
      expect(loadProfile()).toBeNull();
      expect(() => saveCompletedWords(['mama'])).not.toThrow();
      expect(loadCompletedWords()).toEqual([]);

      warnSpy.mockRestore();
      Object.defineProperty(globalThis, 'localStorage', {
        value: original,
        configurable: true,
        writable: true,
      });
    });
  });
});
