import { describe, it, expect } from 'vitest';
import {
    containsDangerousPatterns,
    validateString,
    validateNumber,
    validateDate,
    validateAccount,
    validateTransaction,
    formatValidationErrors,
} from './validation';

describe('containsDangerousPatterns', () => {
    it('detects script tags', () => {
        expect(containsDangerousPatterns('<script>alert("XSS")</script>')).toBe(true);
        expect(containsDangerousPatterns('<SCRIPT>alert("XSS")</SCRIPT>')).toBe(true);
        expect(containsDangerousPatterns('<script src="evil.js">')).toBe(true);
    });

    it('detects javascript: protocol', () => {
        expect(containsDangerousPatterns('javascript:alert(1)')).toBe(true);
        expect(containsDangerousPatterns('JAVASCRIPT:void(0)')).toBe(true);
    });

    it('detects event handlers', () => {
        expect(containsDangerousPatterns('<img onerror="alert(1)">')).toBe(true);
        expect(containsDangerousPatterns('<div onclick="evil()">')).toBe(true);
        expect(containsDangerousPatterns('onload=bad')).toBe(true);
    });

    it('detects iframe, embed, object tags', () => {
        expect(containsDangerousPatterns('<iframe src="evil.html">')).toBe(true);
        expect(containsDangerousPatterns('<embed src="evil.swf">')).toBe(true);
        expect(containsDangerousPatterns('<object data="evil.swf">')).toBe(true);
    });

    it('detects data URLs with HTML', () => {
        expect(containsDangerousPatterns('data:text/html,<script>alert(1)</script>')).toBe(true);
    });

    it('allows normal text', () => {
        expect(containsDangerousPatterns('Coffee & Bagels')).toBe(false);
        expect(containsDangerousPatterns('Buy groceries for $50')).toBe(false);
        expect(containsDangerousPatterns('Transfer to savings account')).toBe(false);
        expect(containsDangerousPatterns('Rent payment - March 2024')).toBe(false);
    });

    it('allows HTML entities in normal text', () => {
        expect(containsDangerousPatterns('Tom & Jerry')).toBe(false);
        expect(containsDangerousPatterns('Price < $100')).toBe(false);
        expect(containsDangerousPatterns('Savings > Expenses')).toBe(false);
    });
});

describe('validateString', () => {
    it('rejects empty required strings', () => {
        expect(validateString('', 'Title')).toEqual({ field: 'Title', message: 'Title is required' });
        expect(validateString(null, 'Title')).toEqual({ field: 'Title', message: 'Title is required' });
        expect(validateString(undefined, 'Title')).toEqual({ field: 'Title', message: 'Title is required' });
    });

    it('rejects non-string types', () => {
        expect(validateString(123, 'Title')).toEqual({ field: 'Title', message: 'Title must be a string' });
        expect(validateString(true, 'Field')).toEqual({ field: 'Field', message: 'Field must be a string' });
        expect(validateString({}, 'Field')).toEqual({ field: 'Field', message: 'Field must be a string' });
    });

    it('allows empty optional strings', () => {
        expect(validateString('', 'Title', { required: false })).toBeNull();
    });

    it('enforces min length', () => {
        expect(validateString('ab', 'Title', { minLength: 3 })).toEqual({
            field: 'Title',
            message: 'Title must be at least 3 characters'
        });
    });

    it('enforces max length', () => {
        const longString = 'A'.repeat(256);
        expect(validateString(longString, 'Account name', { maxLength: 255 })).toEqual({
            field: 'Account name',
            message: 'Account name must be 255 characters or fewer'
        });
    });

    it('rejects dangerous patterns by default', () => {
        expect(validateString('<script>evil()</script>', 'Title')).toEqual({
            field: 'Title',
            message: 'Title contains invalid content'
        });
    });

    it('allows dangerous patterns when disabled', () => {
        expect(validateString('<script>evil()</script>', 'Title', { rejectDangerous: false })).toBeNull();
    });

    it('accepts valid strings', () => {
        expect(validateString('Coffee & Bagels', 'Title')).toBeNull();
        expect(validateString('A'.repeat(255), 'Name', { maxLength: 255 })).toBeNull();
    });

    it('accepts string at exact minLength boundary', () => {
        expect(validateString('abc', 'Title', { minLength: 3 })).toBeNull();
    });

    it('accepts string at exact maxLength boundary', () => {
        expect(validateString('abc', 'Title', { maxLength: 3 })).toBeNull();
    });

    it('returns null for non-required empty values', () => {
        expect(validateString(null, 'Title', { required: false })).toBeNull();
        expect(validateString(undefined, 'Title', { required: false })).toBeNull();
    });

    it('detects SVG event handler XSS patterns', () => {
        expect(validateString('<svg onload=alert(1)>', 'Field')).not.toBeNull();
    });

    it('detects vbscript protocol', () => {
        expect(validateString('vbscript:exec', 'Field')).not.toBeNull();
    });

    it('detects base tag manipulation', () => {
        expect(validateString('<base href="evil">', 'Field')).not.toBeNull();
    });

    it('detects form injection', () => {
        expect(validateString('<form action="evil">', 'Field')).not.toBeNull();
    });

    it('detects CSS expression XSS', () => {
        expect(validateString('expression(alert(1))', 'Field')).not.toBeNull();
    });

    it('detects math tag XSS', () => {
        expect(validateString('<math><maction>click</maction></math>', 'Field')).not.toBeNull();
    });

    it('detects closing script tag', () => {
        expect(validateString('text</script>', 'Field')).not.toBeNull();
    });
});

describe('validateNumber', () => {
    it('rejects non-numbers', () => {
        expect(validateNumber('abc', 'Amount')).toEqual({
            field: 'Amount',
            message: 'Amount must be a valid number'
        });
        expect(validateNumber(NaN, 'Amount')).toEqual({
            field: 'Amount',
            message: 'Amount must be a valid number'
        });
    });

    it('enforces minimum', () => {
        expect(validateNumber(0, 'Amount', { min: 1 })).toEqual({
            field: 'Amount',
            message: 'Amount must be at least 1'
        });
    });

    it('enforces integer constraint', () => {
        expect(validateNumber(10.5, 'Amount', { integer: true })).toEqual({
            field: 'Amount',
            message: 'Amount must be a whole number'
        });
    });

    it('accepts valid numbers', () => {
        expect(validateNumber(1000, 'Amount', { min: 1, integer: true })).toBeNull();
        expect(validateNumber(99.99, 'Rate', { min: 0 })).toBeNull();
    });

    it('enforces maximum', () => {
        expect(validateNumber(101, 'Rate', { max: 100 })).toEqual({
            field: 'Rate',
            message: 'Rate must be at most 100'
        });
    });

    it('accepts number at exact min boundary', () => {
        expect(validateNumber(1, 'Amount', { min: 1 })).toBeNull();
    });

    it('accepts number at exact max boundary', () => {
        expect(validateNumber(100, 'Rate', { max: 100 })).toBeNull();
    });

    it('accepts valid integer', () => {
        expect(validateNumber(42, 'Count', { integer: true })).toBeNull();
    });

    it('allows null/undefined when not required', () => {
        expect(validateNumber(null, 'Amount', { required: false })).toBeNull();
        expect(validateNumber(undefined, 'Amount', { required: false })).toBeNull();
    });

    it('rejects null/undefined when required', () => {
        expect(validateNumber(null, 'Amount')).toEqual({ field: 'Amount', message: 'Amount is required' });
        expect(validateNumber(undefined, 'Amount')).toEqual({ field: 'Amount', message: 'Amount is required' });
    });

    it('accepts negative numbers when no min specified', () => {
        expect(validateNumber(-50, 'Adjustment')).toBeNull();
    });

    it('accepts zero', () => {
        expect(validateNumber(0, 'Count')).toBeNull();
    });
});

describe('validateDate', () => {
    it('rejects invalid dates', () => {
        expect(validateDate('not-a-date', 'Date')).toEqual({
            field: 'Date',
            message: 'Date is not a valid date'
        });
    });

    it('accepts valid date strings', () => {
        expect(validateDate('2024-03-15', 'Date')).toBeNull();
        expect(validateDate('2024-03-15T10:30:00Z', 'Date')).toBeNull();
    });

    it('allows empty optional dates', () => {
        expect(validateDate('', 'Date', { required: false })).toBeNull();
    });

    it('rejects required empty dates', () => {
        expect(validateDate('', 'Date')).toEqual({ field: 'Date', message: 'Date is required' });
    });

    it('rejects null required dates', () => {
        expect(validateDate(null, 'Date')).toEqual({ field: 'Date', message: 'Date is required' });
    });

    it('rejects undefined required dates', () => {
        expect(validateDate(undefined, 'Date')).toEqual({ field: 'Date', message: 'Date is required' });
    });

    it('allows null optional dates', () => {
        expect(validateDate(null, 'Date', { required: false })).toBeNull();
    });

    it('allows undefined optional dates', () => {
        expect(validateDate(undefined, 'Date', { required: false })).toBeNull();
    });

    it('rejects non-string date values', () => {
        expect(validateDate(123, 'Date')).toEqual({ field: 'Date', message: 'Date must be a date string' });
        expect(validateDate(true, 'Date')).toEqual({ field: 'Date', message: 'Date must be a date string' });
    });

    it('accepts ISO date-time format', () => {
        expect(validateDate('2025-01-15T10:30:00.000Z', 'Date')).toBeNull();
    });
});

describe('validateAccount', () => {
    it('validates complete account data', () => {
        const result = validateAccount({
            name: 'Checking Account',
            type: 'checking',
            currency: 'USD',
            balanceCents: 10000
        });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects account with name > 255 chars', () => {
        const result = validateAccount({
            name: 'A'.repeat(256),
            type: 'checking',
            currency: 'USD'
        });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('255 characters');
    });

    it('rejects account with XSS in name', () => {
        const result = validateAccount({
            name: '<script>steal()</script>',
            type: 'checking',
            currency: 'USD'
        });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('invalid content');
    });
});

describe('validateTransaction', () => {
    it('validates complete transaction data', () => {
        const result = validateTransaction({
            title: 'Grocery Shopping',
            amountCents: 5000,
            type: 'expense',
            category: 'Groceries',
            transactionDate: '2024-03-15'
        });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects transaction with title > 500 chars', () => {
        const result = validateTransaction({
            title: 'A'.repeat(501),
            amountCents: 5000,
            type: 'expense'
        });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('500 characters');
    });

    it('rejects transaction with XSS in title', () => {
        const result = validateTransaction({
            title: '<script>alert("XSS")</script>',
            amountCents: 5000,
            type: 'expense'
        });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('invalid content');
    });

    it('rejects negative amounts', () => {
        const result = validateTransaction({
            title: 'Test',
            amountCents: -100,
            type: 'expense'
        });
        expect(result.valid).toBe(false);
        expect(result.errors[0].message).toContain('at least 1');
    });

    it('rejects zero amounts', () => {
        const result = validateTransaction({
            title: 'Test',
            amountCents: 0,
            type: 'expense'
        });
        expect(result.valid).toBe(false);
    });
});

describe('formatValidationErrors', () => {
    it('formats multiple errors', () => {
        const errors = [
            { field: 'Title', message: 'Title is required' },
            { field: 'Amount', message: 'Amount must be positive' }
        ];
        expect(formatValidationErrors(errors)).toBe('Title is required. Amount must be positive');
    });
});
