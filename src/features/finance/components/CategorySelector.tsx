/**
 * CategorySelector - Category input with suggestions
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { CategoryIcon } from '../../../components/shared';
import { Text, HStack, VStack } from '../../../components/primitives';

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
        <VStack gap="xs">
            <HStack gap="xs" align="center">
                <Text as="label" variant="muted" size="xs" weight="bold" className="uppercase">
                    Category
                </Text>
                {error && <Text variant="danger" size="xs" className="animate-pulse">{error}</Text>}
            </HStack>
            <HStack gap="sm" align="center" className="relative">
                <CategoryIcon category={category} size={14} className="scale-110" />
                <div className="flex-1 relative">
                    <select
                        id="tx-category"
                        value={category}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full p-3 rounded-lg border text-sm bg-surface-2 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark cursor-pointer appearance-none ${error ? 'border-danger ring-1 ring-danger' : 'border-[var(--border)]'
                            }`}
                    >
                        {DEFAULT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {suggestedCategory && suggestedCategory !== category && (
                        <button
                            type="button"
                            onClick={onAcceptSuggestion}
                            className="absolute -bottom-6 left-0 text-[10px] text-primary-500 hover:text-primary-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                            💡 Use "{suggestedCategory}" like before?
                        </button>
                    )}
                </div>
            </HStack>
        </VStack>
    );
};

export { DEFAULT_CATEGORIES };

