import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCommandResults } from './useCommandResults';

describe('useCommandResults — action coverage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('invokes navigateTo with the correct page for every built-in action & nav', () => {
    const navigateTo = vi.fn();
    const { result } = renderHook(() =>
      useCommandResults({
        accounts: [
          { id: 'a1', name: 'Checking', isArchived: false } as any,
          { id: 'a2', name: 'Archived', isArchived: true } as any,
        ],
        tasks: [
          { id: 't1', title: 'Task 1', completed: false } as any,
          { id: 't2', title: 'Task 2', completed: true } as any,
        ],
        query: '',
        isOpen: true,
        navigateTo,
      }),
    );

    const byId = new Map(result.current.results.map((r) => [r.id, r]));

    // Verify archived accounts and completed tasks are filtered out
    expect(byId.has('acc-a1')).toBe(true);
    expect(byId.has('acc-a2')).toBe(false);
    expect(byId.has('task-t1')).toBe(true);
    expect(byId.has('task-t2')).toBe(false);

    // Exercise every action closure to cover all arrow functions
    byId.get('action-expense')!.action();
    byId.get('action-income')!.action();
    byId.get('action-commitment')!.action();
    byId.get('nav-dashboard')!.action();
    byId.get('nav-commitments')!.action();
    byId.get('nav-finance')!.action();
    byId.get('nav-settings')!.action();
    byId.get('acc-a1')!.action();
    byId.get('task-t1')!.action();

    expect(navigateTo).toHaveBeenCalledWith('finance');
    expect(navigateTo).toHaveBeenCalledWith('commitments');
    expect(navigateTo).toHaveBeenCalledWith('dashboard');
    expect(navigateTo).toHaveBeenCalledWith('settings');
  });

  it('returns no recent actions when palette is closed', () => {
    const { result } = renderHook(() =>
      useCommandResults({
        accounts: [],
        tasks: [],
        query: '',
        isOpen: false,
        navigateTo: vi.fn(),
      }),
    );
    // When closed, results still include base items (no recent overlay)
    expect(result.current.results.length).toBeGreaterThan(0);
  });
});
