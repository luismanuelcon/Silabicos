import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { useWordValidation } from './useWordValidation';
import { GameProvider } from '../contexts/GameContext';
import { DictionaryProvider } from '../contexts/DictionaryContext';
import { useGame } from '../contexts/GameContext';
import { act } from '@testing-library/react';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <DictionaryProvider>
      <GameProvider>{children}</GameProvider>
    </DictionaryProvider>
  );
}

function useTestHarness() {
  const validation = useWordValidation();
  const { dispatch } = useGame();
  return { validation, dispatch };
}

describe('useWordValidation', () => {
  it('returns empty validation when no syllable', () => {
    const { result } = renderHook(() => useTestHarness(), { wrapper });

    expect(result.current.validation.currentWord).toBe('');
    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.closestMatch).toBeNull();
  });

  it('returns isValid true for a valid word', () => {
    const { result } = renderHook(() => useTestHarness(), { wrapper });

    // Set syllable to "ma" and add letters to form "mama"
    act(() => {
      result.current.dispatch({
        type: 'START_SESSION',
        payload: 'selva',
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'SET_SYLLABLE',
        payload: 'ma',
      });
    });
    // Add "m" and "a" after syllable → "ma" + "ma" = "mama"
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'm', position: 0 },
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'a', position: 1 },
      });
    });

    expect(result.current.validation.currentWord).toBe('mama');
    expect(result.current.validation.isValid).toBe(true);
  });

  it('returns closestMatch for partial valid word', () => {
    const { result } = renderHook(() => useTestHarness(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'START_SESSION',
        payload: 'selva',
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'SET_SYLLABLE',
        payload: 'ma',
      });
    });
    // Add "n" after syllable → "man" — not a valid word but prefix of "mano"
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'n', position: 0 },
      });
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.closestMatch).not.toBeNull();
  });

  it('returns no match for unrelated input', () => {
    const { result } = renderHook(() => useTestHarness(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'START_SESSION',
        payload: 'selva',
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'SET_SYLLABLE',
        payload: 'ma',
      });
    });
    // Add "x", "z", "q" → "maxzq" — no match
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'x', position: 0 },
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'z', position: 1 },
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'q', position: 2 },
      });
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.closestMatch).toBeNull();
  });
});
