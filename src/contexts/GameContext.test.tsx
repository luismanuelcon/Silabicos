import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { GameProvider, useGame } from './GameContext';

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe('GameContext', () => {
  it('throws error when used outside GameProvider', () => {
    expect(() => {
      renderHook(() => useGame());
    }).toThrow('useGame must be used within a GameProvider');
  });

  it('provides initial state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.state).toEqual({
      currentSyllable: null,
      placedLetters: [],
      completedWords: [],
      round: 0,
      selectedWorld: 'selva',
      isSessionActive: false,
    });
  });

  it('START_SESSION activates session with world', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'START_SESSION', payload: 'selva' });
    });

    expect(result.current.state.isSessionActive).toBe(true);
    expect(result.current.state.selectedWorld).toBe('selva');
    expect(result.current.state.round).toBe(0);
  });

  it('SET_SYLLABLE sets syllable and clears letters', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'START_SESSION', payload: 'selva' });
    });
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'A', position: 1 },
      });
    });
    act(() => {
      result.current.dispatch({ type: 'SET_SYLLABLE', payload: 'ma' });
    });

    expect(result.current.state.currentSyllable).toBe('ma');
    expect(result.current.state.placedLetters).toEqual([]);
  });

  it('ADD_LETTER adds a letter', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'P', position: 0 },
      });
    });

    expect(result.current.state.placedLetters).toHaveLength(1);
    expect(result.current.state.placedLetters[0].letter).toBe('P');
  });

  it('REMOVE_LETTER removes a letter by index', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'A', position: 0 },
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'B', position: 1 },
      });
    });
    act(() => {
      result.current.dispatch({ type: 'REMOVE_LETTER', payload: 0 });
    });

    expect(result.current.state.placedLetters).toHaveLength(1);
    expect(result.current.state.placedLetters[0].letter).toBe('B');
  });

  it('COMPLETE_WORD adds word, increments round, resets syllable and letters', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'START_SESSION', payload: 'selva' });
    });
    act(() => {
      result.current.dispatch({ type: 'SET_SYLLABLE', payload: 'ma' });
    });
    act(() => {
      result.current.dispatch({ type: 'COMPLETE_WORD', payload: 'mama' });
    });

    expect(result.current.state.completedWords).toEqual(['mama']);
    expect(result.current.state.round).toBe(1);
    expect(result.current.state.currentSyllable).toBeNull();
    expect(result.current.state.placedLetters).toEqual([]);
  });

  it('RESET_ROUND clears syllable and letters', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_SYLLABLE', payload: 'pa' });
    });
    act(() => {
      result.current.dispatch({
        type: 'ADD_LETTER',
        payload: { letter: 'T', position: 1 },
      });
    });
    act(() => {
      result.current.dispatch({ type: 'RESET_ROUND' });
    });

    expect(result.current.state.currentSyllable).toBeNull();
    expect(result.current.state.placedLetters).toEqual([]);
  });

  it('END_SESSION deactivates session', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'START_SESSION', payload: 'selva' });
    });
    act(() => {
      result.current.dispatch({ type: 'END_SESSION' });
    });

    expect(result.current.state.isSessionActive).toBe(false);
  });
});
