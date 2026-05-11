import type { AvatarId } from '../types/player';

const PROFILE_KEY = 'silabc_player_profile';
const WORDS_KEY = 'silabc_completed_words';
const MAX_WORDS = 20;

interface StoredProfile {
  avatarId: AvatarId;
  name: string;
  totalWordsCount: number;
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__silabc_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function warnUnavailable(): void {
  if (import.meta.env.DEV) {
    console.warn('[SILABC] LocalStorage no disponible — sesión sin persistencia');
  }
}

function saveProfile(profile: StoredProfile): void {
  if (!isLocalStorageAvailable()) {
    warnUnavailable();
    return;
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function loadProfile(): StoredProfile | null {
  if (!isLocalStorageAvailable()) {
    warnUnavailable();
    return null;
  }
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'avatarId' in parsed &&
      'name' in parsed &&
      'totalWordsCount' in parsed
    ) {
      return parsed as StoredProfile;
    }
    return null;
  } catch {
    return null;
  }
}

function saveCompletedWords(words: string[]): void {
  if (!isLocalStorageAvailable()) {
    warnUnavailable();
    return;
  }
  const trimmed = words.slice(-MAX_WORDS);
  localStorage.setItem(WORDS_KEY, JSON.stringify(trimmed));
}

function loadCompletedWords(): string[] {
  if (!isLocalStorageAvailable()) {
    warnUnavailable();
    return [];
  }
  const raw = localStorage.getItem(WORDS_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((w) => typeof w === 'string')) {
      return (parsed as string[]).slice(-MAX_WORDS);
    }
    return [];
  } catch {
    return [];
  }
}

function clearStorage(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(WORDS_KEY);
}

export {
  saveProfile,
  loadProfile,
  saveCompletedWords,
  loadCompletedWords,
  clearStorage,
};
export type { StoredProfile };
