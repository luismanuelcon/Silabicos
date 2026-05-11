import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { PlayerState, PlayerAction } from '../types/player';
import {
  loadProfile,
  loadCompletedWords,
  saveProfile,
  saveCompletedWords,
} from '../services/storageService';

const initialState: PlayerState = {
  avatarId: null,
  name: '',
  wordsCompleted: [],
  totalWordsCount: 0,
};

function playerReducer(
  state: PlayerState,
  action: PlayerAction,
): PlayerState {
  switch (action.type) {
    case 'SET_AVATAR':
      return { ...state, avatarId: action.payload };
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'ADD_COMPLETED_WORD': {
      const updatedWords = [...state.wordsCompleted, action.payload].slice(-20);
      return {
        ...state,
        wordsCompleted: updatedWords,
        totalWordsCount: state.totalWordsCount + 1,
      };
    }
    case 'LOAD_PROFILE':
      return {
        ...state,
        avatarId: action.payload.avatarId,
        name: action.payload.name,
        wordsCompleted: action.payload.wordsCompleted,
        totalWordsCount: action.payload.totalWordsCount,
      };
    case 'RESET_PLAYER':
      return initialState;
    default:
      return state;
  }
}

interface PlayerContextValue {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (context === null) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Load profile from storage on mount
  useEffect(() => {
    const profile = loadProfile();
    const words = loadCompletedWords();
    if (profile) {
      dispatch({
        type: 'LOAD_PROFILE',
        payload: {
          avatarId: profile.avatarId,
          name: profile.name,
          wordsCompleted: words,
          totalWordsCount: profile.totalWordsCount,
        },
      });
    }
  }, []);

  // Auto-save profile when relevant state changes
  useEffect(() => {
    if (state.avatarId) {
      saveProfile({
        avatarId: state.avatarId,
        name: state.name,
        totalWordsCount: state.totalWordsCount,
      });
    }
  }, [state.avatarId, state.name, state.totalWordsCount]);

  // Auto-save completed words when they change
  useEffect(() => {
    if (state.wordsCompleted.length > 0) {
      saveCompletedWords(state.wordsCompleted);
    }
  }, [state.wordsCompleted]);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

export { PlayerProvider, usePlayer };
