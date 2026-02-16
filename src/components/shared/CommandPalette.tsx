// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AnchorContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useCommandResults } from './useCommandResults';

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { navigateTo } = useApp();
    const { accounts } = useFinance();
    const { tasks } = useTasks();
    const inputRef = useRef<HTMLInputElement>(null);

    const { results, executeAction } = useCommandResults({ accounts, tasks, query, isOpen, navigateTo });

    const handleExecute = useCallback((index: number) => {
        if (results[index]) {
            executeAction(results[index]);
            setIsOpen(false);
            setQuery('');
        }
    }, [results, executeAction]);

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
            handleExecute(selectedIndex);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search queries, pages, or actions..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 h-8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleListKeyDown}
                        autoFocus
                    />
                    <div className="hidden sm:flex items-center gap-1">
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-1.5 py-0.5">ESC</span>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No results found.</div>
                    ) : (
                        results.map((item, index) => {
                            const Icon = item.icon;
                            const isSelected = index === selectedIndex;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleExecute(index)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`} />
                                    <span className="flex-1 text-left line-clamp-1 font-medium">{item.title}</span>
                                    {isSelected && <ArrowRight className="w-3.5 h-3.5 opacity-50" />}
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Select <kbd className="font-sans">↑↓</kbd></span>
                    <span>Open <kbd className="font-sans">↵</kbd></span>
                </div>
            </div>
        </div>
    );
};
