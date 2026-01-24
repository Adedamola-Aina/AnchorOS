/**
 * useFabricSuggestions
 * 
 * Fabric v1.5: Intelligent suggestion system that bridges commitments to transactions.
 * When a user completes a financial-related commitment, suggests recording it in Finance.
 * 
 * @example
 * const { suggestions, onCommitmentCompleted, dismissSuggestion } = useFabricSuggestions();
 */

import { useState, useCallback } from 'react';
import type { AnchorTask, TabView } from '../types';

export interface FabricSuggestion {
    id: string;
    type: 'financial' | 'commitment' | 'milestone' | 'warning';
    title: string;
    message: string;
    action: () => void;
    dismiss: () => void;
    metadata?: {
        amount?: number;
        category?: string;
        accountId?: string;
        taskTitle?: string;
    };
}

interface UseFabricSuggestionsResult {
    suggestions: FabricSuggestion[];
    onCommitmentCompleted: (task: AnchorTask, navigateTo: (tab: TabView) => void) => void;
    dismissSuggestion: (id: string) => void;
    clearAllSuggestions: () => void;
}

// Financial keywords that trigger transaction suggestions
const FINANCIAL_KEYWORDS = [
    'pay', 'buy', 'bill', 'rent', 'subscription', 'lease', 'insurance',
    'tax', 'purchase', 'spent', 'grocery', 'utilities', 'electric',
    'water', 'internet', 'phone', 'gas', 'fuel', 'medicine', 'doctor'
];

// Category detection keywords - ordered by specificity
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Transportation': ['fuel', 'uber', 'lyft', 'transit', 'bus', 'train', 'car gas', 'gas for car', 'petrol', 'gasoline'],
    'Bills & Utilities': ['electric', 'water', 'gas bill', 'internet', 'phone', 'utility', 'bill'],
    'Rent': ['rent', 'lease', 'housing', 'mortgage'],
    'Insurance': ['insurance', 'premium', 'policy'],
    'Groceries': ['grocery', 'groceries', 'food', 'supermarket', 'market'],
    'Subscriptions': ['subscription', 'netflix', 'spotify', 'membership', 'premium'],
    'Health': ['medicine', 'doctor', 'pharmacy', 'hospital', 'clinic', 'health'],
    'Shopping': ['buy', 'purchase', 'shop', 'store'],
};

/**
 * Parse amount from text patterns like "$150", "150 dollars", "NGN 5000"
 */
export function parseAmountFromText(text: string): number | null {
    const patterns = [
        /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/,                    // $150 or $1,500.00
        /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/i,  // 150 dollars
        /(?:NGN|₦)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,        // NGN 5000 or ₦5000
        /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:naira|ngn)/i,    // 5000 naira
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return parseFloat(match[1].replace(/,/g, ''));
        }
    }
    return null;
}

/**
 * Detect transaction category from text
 */
export function detectCategory(text: string): string {
    const textLower = text.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => textLower.includes(kw))) {
            return category;
        }
    }
    return 'General';
}

/**
 * Check if text contains financial keywords
 */
export function isFinanciallyRelevant(text: string): boolean {
    const textLower = text.toLowerCase();
    return FINANCIAL_KEYWORDS.some(kw => textLower.includes(kw));
}

export function useFabricSuggestions(): UseFabricSuggestionsResult {
    const [suggestions, setSuggestions] = useState<FabricSuggestion[]>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const dismissSuggestion = useCallback((id: string) => {
        setDismissed(prev => new Set(prev).add(id));
        setSuggestions(prev => prev.filter(s => s.id !== id));
    }, []);

    const clearAllSuggestions = useCallback(() => {
        setSuggestions([]);
        setDismissed(new Set());
    }, []);

    const onCommitmentCompleted = useCallback((
        task: AnchorTask,
        navigateTo: (tab: TabView) => void
    ) => {
        // Only suggest for financially relevant tasks
        if (!isFinanciallyRelevant(task.title)) {
            return;
        }

        const suggestionId = `tx-${task.id}-${Date.now()}`;

        // Don't suggest if already dismissed
        if (dismissed.has(suggestionId.split('-').slice(0, 2).join('-'))) {
            return;
        }

        const amount = parseAmountFromText(task.title);
        const category = detectCategory(task.title);


        const suggestion: FabricSuggestion = {
            id: suggestionId,
            type: 'financial',
            title: 'Record Transaction?',
            message: `You completed "${task.title}". Want to record this in Finance?`,
            action: () => {
                // Navigate to finance page
                // TODO: Future enhancement - pass prefill data via URL params or global state
                navigateTo('finance');
                dismissSuggestion(suggestionId);
            },
            dismiss: () => dismissSuggestion(suggestionId),
            metadata: {
                amount: amount || undefined,
                category,
                taskTitle: task.title,
            }
        };

        setSuggestions(prev => [...prev, suggestion]);
    }, [dismissed, dismissSuggestion]);

    // Filter out dismissed suggestions
    const activeSuggestions = suggestions.filter(s => !dismissed.has(s.id));

    return {
        suggestions: activeSuggestions,
        onCommitmentCompleted,
        dismissSuggestion,
        clearAllSuggestions,
    };
}
