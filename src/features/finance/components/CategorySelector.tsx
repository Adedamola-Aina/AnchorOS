/**
 * CategorySelector
 * 
 * Category input with datalist suggestions and smart category hints.
 * Extracted from TransactionForm for modularity.
 */

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
                    <input
                        id="tx-category"
                        list="category-suggestions"
                        value={category}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Select or type..."
                        className={`w-full p-3 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'
                            }`}
                    />
                    <datalist id="category-suggestions">
                        {DEFAULT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat} />
                        ))}
                    </datalist>

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
