/**
 * TransactionForm Hooks
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


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
    const [selectedAccId, setSelectedAccId] = useState(() => {
        if (initialData?.accountId) return initialData.accountId;
        if (defaultAccountId) return defaultAccountId;
        const lastAccId = localStorage.getItem('anchor_last_account_id');
        if (lastAccId && accounts.find(a => a.id === lastAccId)) return lastAccId;
        return accounts[0]?.id || '';
    });
    const [destinationAccId, setDestinationAccIdState] = useState(() => (
        initialData?.destinationAccountId
        || accounts.find(a => a.id !== selectedAccId)?.id
        || ''
    ));
    const [type, setType] = useState<TransactionType>(initialData?.type || defaultType);
    const [category, setCategory] = useState(initialData?.category || prefillData?.category || 'General');
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
    const [exchangeRate, setExchangeRate] = useState('1.0');
    const [title, setTitle] = useState(initialData?.title || prefillData?.title || '');

    const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
        const delay = title.length >= 2 && type !== 'transfer' ? 300 : 0;
        suggestionTimeoutRef.current = setTimeout(() => {
            if (title.length < 2 || type === 'transfer') {
                setSuggestedCategory(null);
                return;
            }
            const suggestion = suggestCategory(title, transactions);
            setSuggestedCategory(suggestion && suggestion !== category ? suggestion : null);
        }, delay);
        return () => { if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current); };
    }, [title, transactions, category, type]);

    const handleSetAccount = (id: string) => {
        setSelectedAccId(id);
        setExchangeRate('1.0');
        if (destinationAccId === id && accounts.length > 1) {
            setDestinationAccIdState(accounts.find(a => a.id !== id)?.id || '');
        }
        localStorage.setItem('anchor_last_account_id', id);
    };

    const handleSetDestinationAccount = (id: string) => {
        const nextId = id === selectedAccId && accounts.length > 1
            ? accounts.find(a => a.id !== selectedAccId)?.id || ''
            : id;
        setDestinationAccIdState(nextId);
        setExchangeRate('1.0');
    };

    return {
        selectedAccId, setSelectedAccId: handleSetAccount,
        destinationAccId, setDestinationAccId: handleSetDestinationAccount,
        type, setType,
        category, setCategory,
        suggestedCategory, setSuggestedCategory,
        exchangeRate, setExchangeRate,
        title, setTitle,
    };
}
