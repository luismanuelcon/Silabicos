export type Screen =
  | 'avatar-select'
  | 'name-input'
  | 'world-select'
  | 'gameplay'
  | 'summary'
  | 'welcome';

export type NavigationDirection = 'forward' | 'back';

export interface NavigationState {
  currentScreen: Screen;
  previousScreen: Screen | null;
  direction: NavigationDirection;
}

export type NavigationAction =
  | { type: 'NAVIGATE_TO'; payload: Screen }
  | { type: 'GO_HOME' };
