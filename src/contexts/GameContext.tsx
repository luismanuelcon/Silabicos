import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';

const initialState: GameState = {
  currentSyllable: null,
  syllablePosition: 'start',
  placedLetters: [],
  completedWords: [],
  round: 0,
  selectedWorld: 'selva',
  isSessionActive: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...initialState,
        selectedWorld: action.payload,
        isSessionActive: true,
      };
    case 'SET_SYLLABLE':
      return {
        ...state,
        currentSyllable: action.payload.syllable,
        syllablePosition: action.payload.position,
        placedLetters: [],
      };
    case 'ADD_LETTER':
      return {
        ...state,
        placedLetters: [...state.placedLetters, action.payload],
      };
    case 'REMOVE_LETTER':
      return {
        ...state,
        placedLetters: state.placedLetters.filter(
          (_, i) => i !== action.payload,
        ),
      };
    case 'COMPLETE_WORD':
      return {
        ...state,
        completedWords: [...state.completedWords, action.payload],
        round: state.round + 1,
        currentSyllable: null,
        placedLetters: [],
      };
    case 'RESET_ROUND':
      return {
        ...state,
        currentSyllable: null,
        placedLetters: [],
      };
    case 'END_SESSION':
      return {
        ...state,
        isSessionActive: false,
      };
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export { GameProvider, useGame };
