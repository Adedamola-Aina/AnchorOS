/**
 * Entity Validation Schemas
 * Extracted from validation.ts per CLAUDE.md §3.2
 */

import { validateString, validateNumber, validateDate, type ValidationError, type ValidationResult } from './validation';

/**
 * Validate account creation/update input
 */
export function validateAccount(data: Record<string, unknown>): ValidationResult {
    const errors: ValidationError[] = [];

    const nameError = validateString(data.name, 'Account name', { minLength: 1, maxLength: 255 });
    if (nameError) errors.push(nameError);

    const typeError = validateString(data.type, 'Account type', { maxLength: 50 });
    if (typeError) errors.push(typeError);

    const currencyError = validateString(data.currency, 'Currency', { maxLength: 10 });
    if (currencyError) errors.push(currencyError);

    if (data.balanceCents !== undefined) {
        const balanceError = validateNumber(data.balanceCents, 'Balance', { integer: true });
        if (balanceError) errors.push(balanceError);
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate transaction creation/update input
 */
export function validateTransaction(data: Record<string, unknown>): ValidationResult {
    const errors: ValidationError[] = [];

    const titleError = validateString(data.title, 'Description', { minLength: 1, maxLength: 500 });
    if (titleError) errors.push(titleError);

    const amountError = validateNumber(data.amountCents, 'Amount', { min: 1, integer: true });
    if (amountError) errors.push(amountError);

    const typeError = validateString(data.type, 'Transaction type', { maxLength: 20 });
    if (typeError) errors.push(typeError);

    const categoryError = validateString(data.category, 'Category', { maxLength: 50, required: false });
    if (categoryError) errors.push(categoryError);

    const dateError = validateDate(data.transactionDate, 'Date', { required: false });
    if (dateError) errors.push(dateError);

    return { valid: errors.length === 0, errors };
}

/**
 * Validate profile update input
 */
export function validateProfileUpdate(data: Record<string, unknown>): ValidationResult {
    const errors: ValidationError[] = [];

    if (data.name !== undefined) {
        const nameError = validateString(data.name, 'Display name', { minLength: 1, maxLength: 100 });
        if (nameError) errors.push(nameError);
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
    return errors.map(e => e.message).join('. ');
}
