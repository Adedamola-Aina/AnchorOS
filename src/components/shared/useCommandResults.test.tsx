import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { getRecentActions, trackAction, useCommandResults } from './useCommandResults';

describe('useCommandResults', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns empty recent actions when storage is empty', () => {
    expect(getRecentActions()).toEqual([]);
  });

  it('returns empty recent actions for malformed storage payload', () => {
    localStorage.setItem('anchor_recent_actions', '{not-json');
    expect(getRecentActions()).toEqual([]);
  });

  it('tracks actions, deduplicates by id, and caps history to five', () => {
    for (let i = 0; i < 6; i += 1) {
      trackAction({ id: `action-${i}`, title: `Action ${i}`, type: 'Actions' });
    }
    trackAction({ id: 'action-4', title: 'Action 4 (new)', type: 'Actions' });

    const recent = getRecentActions();
    expect(recent).toHaveLength(5);
    expect(recent[0].id).toBe('action-4');
    expect(recent.filter((item) => item.id === 'action-4')).toHaveLength(1);
  });

  it('provides filtered results for search queries and supports execution', () => {
    const navigateTo = vi.fn();
    const { result } = renderHook(() =>
      useCommandResults({
        accounts: [{ id: 'a1', name: 'Wallet', isArchived: false }] as any,
        tasks: [{ id: 't1', title: 'Pay rent', completed: false }] as any,
        query: 'wallet',
        isOpen: true,
        navigateTo,
      }),
    );

    expect(result.current.results.some((entry) => entry.title === 'Wallet')).toBe(true);

    const financeAction = result.current.results.find((entry) => entry.title === 'Wallet');
    expect(financeAction).toBeDefined();
    result.current.executeAction(financeAction!);

    expect(navigateTo).toHaveBeenCalledWith('finance');
    expect(getRecentActions()[0].id).toBe('acc-a1');
  });

  it('prioritizes recent actions when query is empty', () => {
    trackAction({ id: 'nav-settings', title: 'Go to Settings', type: 'Pages' });
    const navigateTo = vi.fn();
    const { result } = renderHook(() =>
      useCommandResults({
        accounts: [],
        tasks: [],
        query: '   ',
        isOpen: true,
        navigateTo,
      }),
    );

    expect(result.current.results[0].id).toBe('nav-settings');
    expect(result.current.results[0].type).toBe('Recent');
  });
});
