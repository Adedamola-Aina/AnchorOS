/**
 * CategorySelector
 * 
 * Category input with datalist suggestions and smart category hints.
 * Extracted from TransactionForm for modularity.
 */
// @ts-nocheck


import React from 'react';
import { CategoryIcon } from '../../../components/shared';

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
    return (
        <div>
            <label htmlFor="tx-category" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Category
                {error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
            </label>
            <div className="flex items-center gap-3 relative">
                <CategoryIcon category={category} size={14} className="scale-110" />
                <div className="flex-1 relative">
                    <select
                        id="tx-category"
                        value={category}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full p-3 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer appearance-none ${error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'
                            }`}
                    >
                        {DEFAULT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {suggestedCategory && suggestedCategory !== category && (
                        <button
                            type="button"
                            onClick={onAcceptSuggestion}
                            className="absolute -bottom-6 left-0 text-[10px] text-blue-500 hover:text-blue-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                            💡 Use "{suggestedCategory}" like before?
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export { DEFAULT_CATEGORIES };
