/**
 * Tests for entityValidation.ts — validateAccount, validateTransaction, validateProfileUpdate, formatValidationErrors
 * Target: 90%+ mutation kill rate
 */
// @ts-nocheck


import { describe, it, expect } from 'vitest';
import {
    validateAccount,
    validateTransaction,
    validateProfileUpdate,
    formatValidationErrors,
} from './entityValidation';

describe('validateAccount', () => {
    it('validates a complete valid account', () => {
        const result = validateAccount({ name: 'Checking', type: 'checking', currency: 'USD' });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects missing name', () => {
        const result = validateAccount({ type: 'checking', currency: 'USD' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].field).toBe('Account name');
    });

    it('rejects empty name', () => {
        const result = validateAccount({ name: '', type: 'checking', currency: 'USD' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field === 'Account name')).toBe(true);
    });

    it('rejects name exceeding 255 chars', () => {
        const result = validateAccount({ name: 'A'.repeat(256), type: 'checking', currency: 'USD' });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('255');
    });

    it('accepts name at exactly 255 chars', () => {
        const result = validateAccount({ name: 'A'.repeat(255), type: 'checking', currency: 'USD' });
        expect(result.valid).toBe(true);
    });

    it('rejects type exceeding 50 chars', () => {
        const result = validateAccount({ name: 'Test', type: 'A'.repeat(51), currency: 'USD' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field === 'Account type')).toBe(true);
    });

    it('accepts type at exactly 50 chars', () => {
        const result = validateAccount({ name: 'Test', type: 'A'.repeat(50), currency: 'USD' });
        expect(result.valid).toBe(true);
    });

    it('rejects currency exceeding 10 chars', () => {
        const result = validateAccount({ name: 'Test', type: 'checking', currency: 'ABCDEFGHIJK' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field === 'Currency')).toBe(true);
    });

    it('accepts currency at exactly 10 chars', () => {
        const result = validateAccount({ name: 'Test', type: 'checking', currency: 'ABCDEFGHIJ' });
        expect(result.valid).toBe(true);
    });

    it('validates balanceCents when provided', () => {
        const result = validateAccount({ name: 'Test', type: 'checking', currency: 'USD', balanceCents: 10000 });
        expect(result.valid).toBe(true);
    });

    it('rejects non-integer balanceCents', () => {
        const result = validateAccount({ name: 'Test', type: 'checking', currency: 'USD', balanceCents: 100.5 });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field === 'Balance')).toBe(true);
    });

    it('skips balanceCents validation when undefined', () => {
        const result = validateAccount({ name: 'Test', type: 'checking', currency: 'USD' });
        expect(result.valid).toBe(true);
    });

    it('rejects non-number balanceCents', () => {
        const result = validateAccount({ name: 'Test', type: 'checking', currency: 'USD', balanceCents: 'abc' });
        expect(result.valid).toBe(false);
    });

    it('collects multiple errors', () => {
        const result = validateAccount({ name: '', type: '', currency: '' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });

    it('rejects XSS in name', () => {
        const result = validateAccount({ name: '<script>alert(1)</script>', type: 'a', currency: 'USD' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.message.includes('invalid content'))).toBe(true);
    });

    it('rejects XSS in type field', () => {
        const result = validateAccount({ name: 'Test', type: 'javascript:void(0)', currency: 'USD' });
        expect(result.valid).toBe(false);
    });
});

describe('validateTransaction', () => {
    it('validates a complete valid transaction', () => {
        const result = validateTransaction({ title: 'Groceries', amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects missing title', () => {
        const result = validateTransaction({ amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field === 'Description')).toBe(true);
    });

    it('rejects empty title', () => {
        const result = validateTransaction({ title: '', amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(false);
    });

    it('rejects title > 500 chars', () => {
        const result = validateTransaction({ title: 'A'.repeat(501), amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('500');
    });

    it('accepts title at exactly 500 chars', () => {
        const result = validateTransaction({ title: 'A'.repeat(500), amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(true);
    });

    it('rejects missing amountCents', () => {
        const result = validateTransaction({ title: 'Test', type: 'expense' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field === 'Amount')).toBe(true);
    });

    it('rejects zero amountCents', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 0, type: 'expense' });
        expect(result.valid).toBe(false);
    });

    it('rejects negative amountCents', () => {
        const result = validateTransaction({ title: 'Test', amountCents: -1, type: 'expense' });
        expect(result.valid).toBe(false);
    });

    it('accepts amountCents of 1 (minimum valid)', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 1, type: 'expense' });
        expect(result.valid).toBe(true);
    });

    it('rejects non-integer amountCents', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 10.5, type: 'expense' });
        expect(result.valid).toBe(false);
    });

    it('rejects type > 20 chars', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'A'.repeat(21) });
        expect(result.valid).toBe(false);
    });

    it('accepts type at exactly 20 chars', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'A'.repeat(20) });
        expect(result.valid).toBe(true);
    });

    it('accepts optional category when provided', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'expense', category: 'Food' });
        expect(result.valid).toBe(true);
    });

    it('rejects category > 50 chars', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'expense', category: 'A'.repeat(51) });
        expect(result.valid).toBe(false);
    });

    it('accepts absent category (optional)', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(true);
    });

    it('accepts valid transactionDate', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'expense', transactionDate: '2025-06-15' });
        expect(result.valid).toBe(true);
    });

    it('rejects invalid transactionDate', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'expense', transactionDate: 'not-a-date' });
        expect(result.valid).toBe(false);
    });

    it('accepts absent transactionDate (optional)', () => {
        const result = validateTransaction({ title: 'Test', amountCents: 5000, type: 'expense' });
        expect(result.valid).toBe(true);
    });

    it('collects multiple validation errors', () => {
        const result = validateTransaction({ title: '', amountCents: 0, type: '' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
});

describe('validateProfileUpdate', () => {
    it('validates when name is provided and valid', () => {
        const result = validateProfileUpdate({ name: 'Jane Doe' });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects empty name', () => {
        const result = validateProfileUpdate({ name: '' });
        expect(result.valid).toBe(false);
        expect(result.errors[0].field).toBe('Display name');
    });

    it('rejects name > 100 chars', () => {
        const result = validateProfileUpdate({ name: 'A'.repeat(101) });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('100');
    });

    it('accepts name at exactly 100 chars', () => {
        const result = validateProfileUpdate({ name: 'A'.repeat(100) });
        expect(result.valid).toBe(true);
    });

    it('passes when no name provided (undefined)', () => {
        const result = validateProfileUpdate({});
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects XSS in name', () => {
        const result = validateProfileUpdate({ name: '<script>steal()</script>' });
        expect(result.valid).toBe(false);
    });
});

describe('formatValidationErrors', () => {
    it('formats single error', () => {
        expect(formatValidationErrors([{ field: 'Name', message: 'Name is required' }]))
            .toBe('Name is required');
    });

    it('formats multiple errors with period separator', () => {
        const errors = [
            { field: 'Name', message: 'Name is required' },
            { field: 'Amount', message: 'Amount must be positive' },
        ];
        expect(formatValidationErrors(errors)).toBe('Name is required. Amount must be positive');
    });

    it('returns empty string for empty array', () => {
        expect(formatValidationErrors([])).toBe('');
    });

    it('formats three errors', () => {
        const errors = [
            { field: 'A', message: 'A bad' },
            { field: 'B', message: 'B bad' },
            { field: 'C', message: 'C bad' },
        ];
        expect(formatValidationErrors(errors)).toBe('A bad. B bad. C bad');
    });
});
