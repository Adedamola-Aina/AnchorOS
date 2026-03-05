import { useState, useEffect, useRef, useCallback } from 'react';

type FilterType = 'all' | 'income' | 'expense';

interface PersistedFilters {
    filterType: FilterType;
    searchQuery: string;
}

const DEBOUNCE_MS = 500;
const STORAGE_PREFIX = 'anchor_filters_';

function loadFilters(viewKey: string): PersistedFilters {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + viewKey);
        if (!raw) return { filterType: 'all', searchQuery: '' };
        const parsed = JSON.parse(raw);
        return {
            filterType: parsed.filterType || 'all',
            searchQuery: parsed.searchQuery || '',
        };
    } catch {
        return { filterType: 'all', searchQuery: '' };
    }
}

export function useFilterPersistence(viewKey: string) {
    const [filters, setFilters] = useState<PersistedFilters>(() => loadFilters(viewKey));
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const persist = useCallback((updated: PersistedFilters) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            localStorage.setItem(STORAGE_PREFIX + viewKey, JSON.stringify(updated));
        }, DEBOUNCE_MS);
    }, [viewKey]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const setFilterType = useCallback((filterType: FilterType) => {
        setFilters(prev => {
            const next = { ...prev, filterType };
            persist(next);
            return next;
        });
    }, [persist]);

    const setSearchQuery = useCallback((searchQuery: string) => {
        setFilters(prev => {
            const next = { ...prev, searchQuery };
            persist(next);
            return next;
        });
    }, [persist]);

    const clearFilters = useCallback(() => {
        clearTimeout(timerRef.current);
        setFilters({ filterType: 'all', searchQuery: '' });
        localStorage.removeItem(STORAGE_PREFIX + viewKey);
    }, [viewKey]);

    return {
        filterType: filters.filterType,
        searchQuery: filters.searchQuery,
        setFilterType,
        setSearchQuery,
        clearFilters,
    };
}
