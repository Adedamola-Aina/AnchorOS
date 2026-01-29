/**
 * Finance Service Types
 * 
 * Type definitions for finance service payloads.
 * Centralized here to keep service files under 200 lines.
 * 
 * @module services/financeTypes
 */

import type { TransactionType, Currency } from '../types';

/**
 * Payload for creating a new account
 */
export interface CreateAccountPayload {
    name: string;
    type: 'checking' | 'savings' | 'salary' | 'investment';
    currency: Currency;
    balanceCents: number;
    color: string;
    scope: 'personal' | 'family';
}

/**
 * Payload for creating a new transaction
 */
export interface CreateTransactionPayload {
    title: string;
    amountCents: number;
    type: TransactionType;
    category: string;
    accountId: string;
    accountName?: string;
    currency: string;
    scope: 'personal' | 'family';
    destinationAccountId?: string;
    destinationAmountCents?: number;
    exchangeRate?: number;
    date?: string;
}

/**
 * Payload for updating a transaction
 */
export interface UpdateTransactionPayload {
    title?: string;
    amountCents?: number;
    type?: TransactionType;
    category?: string;
    scope?: 'personal' | 'family';
    date?: string;
    transactionDate?: string;
}
