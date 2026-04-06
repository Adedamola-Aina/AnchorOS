/**
 * CategorySelector
 * 
 * Category input with datalist suggestions, smart category hints,
 * and custom user-defined categories (PRD-010).
 */
// @ts-nocheck


import React, { useState, useMemo } from 'react';
import { CategoryIcon } from '../../../components/shared';
import { PopoverMenu } from '../../../components/shared';

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
    customCategories?: string[];
    onCreateCustom?: (name: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    category, onChange, suggestedCategory, onAcceptSuggestion,
    error, customCategories = [], onCreateCustom,
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const allCategories = useMemo(() => {
        const merged = new Set([...DEFAULT_CATEGORIES, ...customCategories]);
        return [...merged];
    }, [customCategories]);

    const handleCreate = () => {
        const trimmed = newName.trim();
        if (trimmed && onCreateCustom) {
            onCreateCustom(trimmed);
            onChange(trimmed);
        }
        setNewName('');
        setIsCreating(false);
    };

    return (
        <div>
            <label htmlFor="tx-category" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Category
                {error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
            </label>
            <div className="flex items-center gap-3 relative">
                <CategoryIcon category={category} size={14} className="scale-110" />
                <div className="flex-1 relative">
                    <PopoverMenu
                        items={allCategories.map(cat => ({ value: cat, label: cat }))}
                        value={category}
                        onChange={onChange}
                        testId="tx-category"
                    />
                    {suggestedCategory && suggestedCategory !== category && (
                        <button type="button" onClick={onAcceptSuggestion}
                            className="absolute -bottom-6 left-0 text-[10px] text-blue-500 hover:text-blue-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                            💡 Use "{suggestedCategory}" like before?
                        </button>
                    )}
                </div>
            </div>
            {onCreateCustom && !isCreating && (
                <button type="button" data-testid="create-custom-category-btn" onClick={() => setIsCreating(true)}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-600 font-medium">
                    + Custom category
                </button>
            )}
            {isCreating && (
                <div className="mt-2 flex items-center gap-2" data-testid="custom-category-input">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                        placeholder="Category name" maxLength={50} autoFocus
                        className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white min-h-[44px]"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } }} />
                    <button type="button" onClick={handleCreate}
                        className="px-3 py-1 text-xs font-medium bg-slate-800 dark:bg-slate-600 text-white rounded min-h-[44px]">
                        Add
                    </button>
                    <button type="button" onClick={() => { setIsCreating(false); setNewName(''); }}
                        className="px-2 py-1 text-xs text-slate-500 min-h-[44px]">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export { DEFAULT_CATEGORIES };
