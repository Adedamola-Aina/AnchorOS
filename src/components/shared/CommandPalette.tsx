/**
 * CommandPalette - Quick actions and navigation (Cmd+K)
 * DES-002: Migrated to semantic tokens
 * WEB-003: Framer Motion slide-down animation
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, ArrowRight, LayoutDashboard, CheckCircle2, CreditCard, Settings, Wallet, MinusCircle, PlusCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AnchorContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { Text, VStack } from '../primitives';

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

const getRecentActions = (): RecentAction[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as RecentAction[];
    } catch {
        return [];
    }
};

const trackAction = (action: Omit<RecentAction, 'timestamp'>) => {
    try {
        const recent = getRecentActions();
        const newAction: RecentAction = { ...action, timestamp: Date.now() };
        // Remove duplicate if exists, add new at front, limit to MAX_RECENT
        const updated = [newAction, ...recent.filter(a => a.id !== action.id)].slice(0, MAX_RECENT);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // Silently fail if localStorage unavailable
    }
};


export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { navigateTo } = useApp();
    const { accounts } = useFinance();
    const { tasks } = useTasks();
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent actions when palette opens
    const recentActions = useMemo(() => {
        if (!isOpen) return [];
        return getRecentActions();
    }, [isOpen]);

    // Toggle Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Execute action and track it
    const executeAction = useCallback((result: CommandResult) => {
        trackAction({ id: result.id, title: result.title, type: result.type });
        result.action();
        setIsOpen(false);
        setQuery('');
    }, []);

    // Build results with actions and recent
    const results = useMemo<CommandResult[]>(() => {
        const baseResults: CommandResult[] = [
            // Actions (Quick access) - navigate to page
            { id: 'action-expense', title: 'Add Expense', type: 'Actions', icon: MinusCircle, action: () => navigateTo('finance') },
            { id: 'action-income', title: 'Add Income', type: 'Actions', icon: PlusCircle, action: () => navigateTo('finance') },
            { id: 'action-commitment', title: 'New Commitment', type: 'Actions', icon: Plus, action: () => navigateTo('commitments') },

            // Navigation
            { id: 'nav-dashboard', title: 'Go to Dashboard', type: 'Pages', icon: LayoutDashboard, action: () => navigateTo('dashboard') },
            { id: 'nav-commitments', title: 'Go to Commitments', type: 'Pages', icon: CheckCircle2, action: () => navigateTo('commitments') },
            { id: 'nav-finance', title: 'Go to Finance', type: 'Pages', icon: CreditCard, action: () => navigateTo('finance') },
            { id: 'nav-settings', title: 'Go to Settings', type: 'Pages', icon: Settings, action: () => navigateTo('settings') },

            // Accounts
            ...accounts.filter(a => !a.isArchived).map(a => ({
                id: `acc-${a.id}`,
                title: a.name,
                type: 'Accounts',
                icon: Wallet,
                action: () => navigateTo('finance')
            })),

            // Tasks (Top 3 incomplete)
            ...tasks.filter(t => !t.completed).slice(0, 3).map(t => ({
                id: `task-${t.id}`,
                title: t.title,
                type: 'Tasks',
                icon: CheckCircle2,
                action: () => navigateTo('commitments')
            })),
        ];

        // If no query, prepend recent actions at the top
        if (!query.trim() && recentActions.length > 0) {
            const recentResults: CommandResult[] = recentActions
                .map(recent => {
                    const found = baseResults.find(r => r.id === recent.id);
                    if (found) {
                        return { ...found, type: 'Recent' };
                    }
                    return null;
                })
                .filter((r): r is CommandResult => r !== null);

            // Show recent at top, then rest (excluding duplicates)
            const recentIds = new Set(recentResults.map(r => r.id));
            return [...recentResults, ...baseResults.filter(r => !recentIds.has(r.id))];
        }

        // Filter by query
        return baseResults.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );
    }, [accounts, tasks, query, navigateTo, recentActions]);

    // Keyboard Nav - reset index when query changes
    const prevQueryRef = useRef(query);
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            // Only reset index if query changed (not on initial open)
            if (prevQueryRef.current !== query) {
                prevQueryRef.current = query;
            }
        }
    }, [isOpen, query]);

    const handleListKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                executeAction(results[selectedIndex]);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-surface-1/40 dark:bg-surface-1-dark/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Search Modal */}
                    <motion.div
                        className="relative w-full max-w-xl bg-surface-1 dark:bg-surface-1-dark rounded-xl shadow-2xl border border-border-subtle overflow-hidden"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
                    >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
                            <Search className="w-5 h-5 text-muted" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search queries, pages, or actions..."
                                className="flex-1 bg-transparent border-none outline-none text-foreground dark:text-foreground-dark placeholder-muted h-8"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleListKeyDown}
                                autoFocus
                            />
                            <div className="hidden sm:flex items-center gap-1">
                                <span className="text-[10px] font-bold bg-surface-3 dark:bg-surface-3-dark text-muted rounded px-1.5 py-0.5">ESC</span>
                            </div>
                        </div>

                        {/* Results */}
                        <VStack gap="xs" className="max-h-[60vh] overflow-y-auto p-2">
                            {results.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Text variant="muted" size="sm">No results found.</Text>
                                </div>
                            ) : (
                                results.map((item, index) => {
                                    const Icon = item.icon;
                                    const isSelected = index === selectedIndex;

                                    return (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => executeAction(item)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-muted dark:text-muted-dark hover:bg-surface-3 dark:hover:bg-surface-3-dark'}`}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-500' : 'text-muted'}`} />
                                            <span className="flex-1 text-left line-clamp-1 font-medium">{item.title}</span>
                                            {isSelected && <ArrowRight className="w-3.5 h-3.5 opacity-50" />}
                                        </motion.button>
                                    );
                                })
                            )}
                        </VStack>

                        <div className="px-4 py-2 bg-surface-2 dark:bg-surface-2-dark border-t border-border-subtle flex justify-between items-center text-[10px] text-muted">
                            <span>Select <kbd className="font-sans">↑↓</kbd></span>
                            <span>Open <kbd className="font-sans">↵</kbd></span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

