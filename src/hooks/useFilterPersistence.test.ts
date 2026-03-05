// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterPersistence } from './useFilterPersistence';

describe('useFilterPersistence', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns default filter values on first use', () => {
        const { result } = renderHook(() => useFilterPersistence('test-view'));
        expect(result.current.filterType).toBe('all');
        expect(result.current.searchQuery).toBe('');
    });

    it('persists filterType to localStorage after debounce', () => {
        const { result } = renderHook(() => useFilterPersistence('test-view'));

        act(() => { result.current.setFilterType('income'); });
        // Not yet persisted
        expect(localStorage.getItem('anchor_filters_test-view')).toBeNull();

        act(() => { vi.advanceTimersByTime(500); });
        const stored = JSON.parse(localStorage.getItem('anchor_filters_test-view')!);
        expect(stored.filterType).toBe('income');
    });

    it('persists searchQuery to localStorage after debounce', () => {
        const { result } = renderHook(() => useFilterPersistence('test-view'));

        act(() => { result.current.setSearchQuery('groceries'); });
        act(() => { vi.advanceTimersByTime(500); });

        const stored = JSON.parse(localStorage.getItem('anchor_filters_test-view')!);
        expect(stored.searchQuery).toBe('groceries');
    });

    it('restores persisted filters on mount', () => {
        localStorage.setItem('anchor_filters_saved', JSON.stringify({
            filterType: 'expense',
            searchQuery: 'rent',
        }));

        const { result } = renderHook(() => useFilterPersistence('saved'));
        expect(result.current.filterType).toBe('expense');
        expect(result.current.searchQuery).toBe('rent');
    });

    it('uses separate storage keys per view', () => {
        const { result: view1 } = renderHook(() => useFilterPersistence('view-a'));
        const { result: view2 } = renderHook(() => useFilterPersistence('view-b'));

        act(() => { view1.current.setFilterType('income'); });
        act(() => { vi.advanceTimersByTime(500); });

        expect(view2.current.filterType).toBe('all');
    });

    it('handles corrupted localStorage gracefully', () => {
        localStorage.setItem('anchor_filters_corrupt', 'not-json');
        const { result } = renderHook(() => useFilterPersistence('corrupt'));
        expect(result.current.filterType).toBe('all');
        expect(result.current.searchQuery).toBe('');
    });

    it('clearFilters resets to defaults and clears storage', () => {
        localStorage.setItem('anchor_filters_clear-test', JSON.stringify({
            filterType: 'expense', searchQuery: 'food',
        }));

        const { result } = renderHook(() => useFilterPersistence('clear-test'));
        expect(result.current.filterType).toBe('expense');

        act(() => { result.current.clearFilters(); });
        expect(result.current.filterType).toBe('all');
        expect(result.current.searchQuery).toBe('');
        expect(localStorage.getItem('anchor_filters_clear-test')).toBeNull();
    });
});
