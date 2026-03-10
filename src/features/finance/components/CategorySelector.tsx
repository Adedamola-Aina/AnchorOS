/**
 * CategorySelector
 *
 * Category input with smart category hints.
 * Uses a custom inline grid instead of native <select> to avoid
 * the iOS multi-tap bug (native selects require 2+ taps on mobile).
 */
// @ts-nocheck

import React, { useState } from 'react';
import { CategoryIcon } from '../../../components/shared';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_CATEGORIES = [
    'General', 'Food', 'Groceries', 'Transport', 'Housing',
    'Utilities', 'Health', 'Entertainment', 'Travel', 'Education',
    'Salary', 'Investments', 'Shopping', 'Personal Care'
];

interface CategorySelectorProps {
    category: string;
    onChange: (category: string) => void;
    suggestedCategory: string | null;
    onAcceptSuggestion: () => void;
    error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    category,
    onChange,
    suggestedCategory,
    onAcceptSuggestion,
    error
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (cat: string) => {
        onChange(cat);
        setOpen(false);
    };

    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Category
                {error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
            </label>

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer text-left ${
                    error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'
                }`}
            >
                <CategoryIcon category={category} size={14} className="scale-110 shrink-0" />
                <span className="flex-1">{category}</span>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
            </button>

            {/* Inline option grid */}
            {open && (
                <div className="mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 grid grid-cols-3 gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {DEFAULT_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => handleSelect(cat)}
                            className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium text-left transition-colors min-h-[40px] ${
                                cat === category
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-1 ring-primary-400'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <CategoryIcon category={cat} size={12} className="shrink-0" />
                            <span className="leading-tight">{cat}</span>
                        </button>
                    ))}
                </div>
            )}

            {suggestedCategory && suggestedCategory !== category && (
                <button
                    type="button"
                    onClick={onAcceptSuggestion}
                    className="mt-1 text-[10px] text-blue-500 hover:text-blue-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200"
                >
                    💡 Use "{suggestedCategory}" like before?
                </button>
            )}
        </div>
    );
};

export { DEFAULT_CATEGORIES };
