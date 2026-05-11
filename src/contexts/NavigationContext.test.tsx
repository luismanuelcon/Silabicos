import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavigationProvider, useNavigation } from './NavigationContext';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <NavigationProvider>{children}</NavigationProvider>;
}

describe('NavigationContext', () => {
  it('provides initial state with avatar-select screen', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    expect(result.current.state.currentScreen).toBe('avatar-select');
    expect(result.current.state.previousScreen).toBeNull();
    expect(result.current.state.direction).toBe('forward');
  });

  it('NAVIGATE_TO updates currentScreen and sets direction forward', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'NAVIGATE_TO', payload: 'name-input' });
    });

    expect(result.current.state.currentScreen).toBe('name-input');
    expect(result.current.state.previousScreen).toBe('avatar-select');
    expect(result.current.state.direction).toBe('forward');
  });

  it('GO_HOME navigates to avatar-select with direction back', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'NAVIGATE_TO', payload: 'gameplay' });
    });

    act(() => {
      result.current.dispatch({ type: 'GO_HOME' });
    });

    expect(result.current.state.currentScreen).toBe('avatar-select');
    expect(result.current.state.previousScreen).toBe('gameplay');
    expect(result.current.state.direction).toBe('back');
  });

  it('throws when useNavigation is used outside provider', () => {
    expect(() => {
      renderHook(() => useNavigation());
    }).toThrow('useNavigation must be used within a NavigationProvider');
  });
});
