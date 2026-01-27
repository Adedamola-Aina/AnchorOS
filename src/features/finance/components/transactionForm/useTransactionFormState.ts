/**
 * TransactionForm Hooks
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
 */

import { useState, useEffect, useRef } from 'react';
import { suggestCategory } from '../../../../utils/finance';
import type { TransactionType, AnchorTransaction, AnchorAccount } from '../../../../types';

interface UseTransactionFormStateProps {
    accounts: AnchorAccount[];
    transactions: AnchorTransaction[];
    initialData?: AnchorTransaction;
    defaultAccountId?: string;
    defaultType: TransactionType;
    prefillData?: { amount?: number; title?: string; category?: string };
}

export function useTransactionFormState({
    accounts, transactions, initialData, defaultAccountId, defaultType, prefillData
}: UseTransactionFormStateProps) {
    const [selectedAccId, setSelectedAccId] = useState(initialData?.accountId || defaultAccountId || '');
    const [destinationAccId, setDestinationAccId] = useState(initialData?.destinationAccountId || '');
    const [type, setType] = useState<TransactionType>(initialData?.type || defaultType);
    const [category, setCategory] = useState(initialData?.category || prefillData?.category || 'General');
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
    const [exchangeRate, setExchangeRate] = useState('1.0');
    const [title, setTitle] = useState(initialData?.title || prefillData?.title || '');

    // Smart defaults effect
    useEffect(() => {
        if (initialData) return;
        if (defaultAccountId) {
            setSelectedAccId(defaultAccountId);
            return;
        }
        const lastAccId = localStorage.getItem('anchor_last_account_id');
        if (lastAccId && accounts.find(a => a.id === lastAccId)) {
            setSelectedAccId(lastAccId);
        } else if (accounts.length > 0 && !selectedAccId) {
            setSelectedAccId(accounts[0].id);
        }
        if (accounts.length > 1 && !destinationAccId) {
            const dest = accounts.find(a => a.id !== selectedAccId && a.id !== lastAccId);
            setDestinationAccId(dest?.id || accounts[1].id);
        }
    }, [accounts, defaultAccountId, initialData, selectedAccId, destinationAccId]);

    // Prevent same-account transfer
    useEffect(() => {
        if (selectedAccId === destinationAccId && accounts.length > 1) {
            const next = accounts.find(a => a.id !== selectedAccId);
            if (next) setDestinationAccId(next.id);
        }
    }, [selectedAccId, destinationAccId, accounts]);

    // Reset exchange rate on account change
    useEffect(() => {
        setExchangeRate('1.0');
    }, [selectedAccId, destinationAccId]);

    // Smart categorization with debounce
    const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
        if (title.length >= 2 && type !== 'transfer') {
            suggestionTimeoutRef.current = setTimeout(() => {
                const suggestion = suggestCategory(title, transactions);
                if (suggestion && suggestion !== category) {
                    setSuggestedCategory(suggestion);
                } else {
                    setSuggestedCategory(null);
                }
            }, 300);
        } else {
            setSuggestedCategory(null);
        }
        return () => { if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current); };
    }, [title, transactions, category, type]);

    const handleSetAccount = (id: string) => {
        setSelectedAccId(id);
        localStorage.setItem('anchor_last_account_id', id);
    };

    return {
        selectedAccId, setSelectedAccId: handleSetAccount,
        destinationAccId, setDestinationAccId,
        type, setType,
        category, setCategory,
        suggestedCategory, setSuggestedCategory,
        exchangeRate, setExchangeRate,
        title, setTitle,
    };
}
