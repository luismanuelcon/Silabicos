import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { DictionaryProvider, useDictionary } from './DictionaryContext';

function wrapper({ children }: { children: ReactNode }) {
  return <DictionaryProvider>{children}</DictionaryProvider>;
}

describe('DictionaryContext', () => {
  it('throws error when used outside DictionaryProvider', () => {
    expect(() => {
      renderHook(() => useDictionary());
    }).toThrow('useDictionary must be used within a DictionaryProvider');
  });

  it('provides a service with all 4 methods', () => {
    const { result } = renderHook(() => useDictionary(), { wrapper });

    expect(typeof result.current.isValidWord).toBe('function');
    expect(typeof result.current.getWordsForSyllable).toBe('function');
    expect(typeof result.current.getClosestMatch).toBe('function');
    expect(typeof result.current.getRandomSyllable).toBe('function');
  });

  it('service can validate words', () => {
    const { result } = renderHook(() => useDictionary(), { wrapper });

    expect(result.current.isValidWord('mama')).toBe(true);
    expect(result.current.isValidWord('zzzzz')).toBe(false);
  });
});
