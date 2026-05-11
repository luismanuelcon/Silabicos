import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { PlayerProvider, usePlayer } from './PlayerContext';

function wrapper({ children }: { children: ReactNode }) {
  return <PlayerProvider>{children}</PlayerProvider>;
}

describe('PlayerContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial state with null avatarId', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    expect(result.current.state).toEqual({
      avatarId: null,
      name: '',
      wordsCompleted: [],
      totalWordsCount: 0,
    });
  });

  it('throws error when used outside PlayerProvider', () => {
    expect(() => {
      renderHook(() => usePlayer());
    }).toThrow('usePlayer must be used within a PlayerProvider');
  });

  it('SET_AVATAR updates avatarId', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_AVATAR', payload: 'mono' });
    });

    expect(result.current.state.avatarId).toBe('mono');
  });

  it('SET_NAME updates name', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_NAME', payload: 'Valentina' });
    });

    expect(result.current.state.name).toBe('Valentina');
  });

  it('RESET_PLAYER returns to initial state', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_AVATAR', payload: 'rana' });
      result.current.dispatch({ type: 'SET_NAME', payload: 'Mateo' });
    });

    expect(result.current.state.avatarId).toBe('rana');
    expect(result.current.state.name).toBe('Mateo');

    act(() => {
      result.current.dispatch({ type: 'RESET_PLAYER' });
    });

    expect(result.current.state).toEqual({
      avatarId: null,
      name: '',
      wordsCompleted: [],
      totalWordsCount: 0,
    });
  });

  it('ADD_COMPLETED_WORD adds word and increments count', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'ADD_COMPLETED_WORD', payload: 'mama' });
    });

    expect(result.current.state.wordsCompleted).toEqual(['mama']);
    expect(result.current.state.totalWordsCount).toBe(1);
  });

  it('ADD_COMPLETED_WORD trims to 20 words', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      for (let i = 0; i < 22; i++) {
        result.current.dispatch({
          type: 'ADD_COMPLETED_WORD',
          payload: `word${i}`,
        });
      }
    });

    expect(result.current.state.wordsCompleted).toHaveLength(20);
    expect(result.current.state.wordsCompleted[0]).toBe('word2');
    expect(result.current.state.totalWordsCount).toBe(22);
  });

  it('LOAD_PROFILE hydrates state from storage data', () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'LOAD_PROFILE',
        payload: {
          avatarId: 'loro',
          name: 'Ana',
          wordsCompleted: ['casa', 'papa'],
          totalWordsCount: 10,
        },
      });
    });

    expect(result.current.state.avatarId).toBe('loro');
    expect(result.current.state.name).toBe('Ana');
    expect(result.current.state.wordsCompleted).toEqual(['casa', 'papa']);
    expect(result.current.state.totalWordsCount).toBe(10);
  });

  it('auto-loads profile from localStorage on mount', () => {
    localStorage.setItem(
      'silabc_player_profile',
      JSON.stringify({ avatarId: 'rana', name: 'Leo', totalWordsCount: 7 }),
    );
    localStorage.setItem(
      'silabc_completed_words',
      JSON.stringify(['mama', 'papa']),
    );

    const { result } = renderHook(() => usePlayer(), { wrapper });

    expect(result.current.state.avatarId).toBe('rana');
    expect(result.current.state.name).toBe('Leo');
    expect(result.current.state.wordsCompleted).toEqual(['mama', 'papa']);
    expect(result.current.state.totalWordsCount).toBe(7);
  });
});
