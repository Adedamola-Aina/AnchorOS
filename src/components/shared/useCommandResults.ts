/**
 * Command palette result builder and recent action tracking.
 */
// @ts-nocheck


import { useMemo, useCallback } from 'react';
import { LayoutDashboard, CheckCircle2, CreditCard, Settings, Wallet, MinusCircle, PlusCircle, Plus } from 'lucide-react';
import type { AnchorAccount, AnchorTask } from '../../types';

interface CommandResult {
    id: string;
    title: string;
    type: string;
    icon: React.FC<{ className?: string }>;
    action: () => void;
}

interface RecentAction {
    id: string;
    title: string;
    type: string;
    timestamp: number;
}

const STORAGE_KEY = 'anchor_recent_actions';
const MAX_RECENT = 5;

export const getRecentActions = (): RecentAction[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as RecentAction[];
    } catch {
        return [];
    }
};

export const trackAction = (action: Omit<RecentAction, 'timestamp'>) => {
    try {
        const recent = getRecentActions();
        const newAction: RecentAction = { ...action, timestamp: Date.now() };
        const updated = [newAction, ...recent.filter(a => a.id !== action.id)].slice(0, MAX_RECENT);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // Silently fail if localStorage unavailable
    }
};

interface UseCommandResultsOptions {
    accounts: AnchorAccount[];
    tasks: AnchorTask[];
    query: string;
    isOpen: boolean;
    navigateTo: (page: 'dashboard' | 'finance' | 'commitments' | 'settings', params?: Record<string, string | number | undefined>) => void;
}

export function useCommandResults({ accounts, tasks, query, isOpen, navigateTo }: UseCommandResultsOptions) {
    const recentActions = useMemo(() => {
        if (!isOpen) return [];
        return getRecentActions();
    }, [isOpen]);

    const executeAction = useCallback((result: CommandResult) => {
        trackAction({ id: result.id, title: result.title, type: result.type });
        result.action();
    }, []);

    const results = useMemo<CommandResult[]>(() => {
        const baseResults: CommandResult[] = [
            { id: 'action-expense', title: 'Add Expense', type: 'Actions', icon: MinusCircle, action: () => navigateTo('finance') },
            { id: 'action-income', title: 'Add Income', type: 'Actions', icon: PlusCircle, action: () => navigateTo('finance') },
            { id: 'action-commitment', title: 'New Commitment', type: 'Actions', icon: Plus, action: () => navigateTo('commitments') },
            { id: 'nav-dashboard', title: 'Go to Dashboard', type: 'Pages', icon: LayoutDashboard, action: () => navigateTo('dashboard') },
            { id: 'nav-commitments', title: 'Go to Commitments', type: 'Pages', icon: CheckCircle2, action: () => navigateTo('commitments') },
            { id: 'nav-finance', title: 'Go to Finance', type: 'Pages', icon: CreditCard, action: () => navigateTo('finance') },
            { id: 'nav-settings', title: 'Go to Settings', type: 'Pages', icon: Settings, action: () => navigateTo('settings') },
            ...accounts.filter(a => !a.isArchived).map(a => ({
                id: `acc-${a.id}`, title: a.name, type: 'Accounts', icon: Wallet, action: () => navigateTo('finance')
            })),
            ...tasks.filter(t => !t.completed).slice(0, 3).map(t => ({
                id: `task-${t.id}`, title: t.title, type: 'Tasks', icon: CheckCircle2, action: () => navigateTo('commitments')
            })),
        ];

        if (!query.trim() && recentActions.length > 0) {
            const recentResults: CommandResult[] = recentActions
                .map(recent => {
                    const found = baseResults.find(r => r.id === recent.id);
                    return found ? { ...found, type: 'Recent' } : null;
                })
                .filter((r): r is CommandResult => r !== null);

            const recentIds = new Set(recentResults.map(r => r.id));
            return [...recentResults, ...baseResults.filter(r => !recentIds.has(r.id))];
        }

        return baseResults.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );
    }, [accounts, tasks, query, navigateTo, recentActions]);

    return { results, executeAction };
}
