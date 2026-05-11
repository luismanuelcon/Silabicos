import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  NavigationState,
  NavigationAction,
  Screen,
} from '../types/navigation';

const initialState: NavigationState = {
  currentScreen: 'avatar-select',
  previousScreen: null,
  direction: 'forward',
};

function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        currentScreen: action.payload,
        previousScreen: state.currentScreen,
        direction: 'forward',
      };
    case 'GO_HOME': {
      const homeScreen: Screen = 'avatar-select';
      return {
        currentScreen: homeScreen,
        previousScreen: state.currentScreen,
        direction: 'back',
      };
    }
    default:
      return state;
  }
}

interface NavigationContextValue {
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (context === null) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider, useNavigation };
