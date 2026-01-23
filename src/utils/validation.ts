/**
 * Unified Input Validation Layer
 * 
 * This module provides schema-based validation for all user input.
 * It REJECTS malicious or invalid input rather than trying to sanitize it.
 * 
 * Philosophy:
 * - Validate at write time, reject with 400 if invalid
 * - Store original input as-is (no encoding)
 * - Trust React's default escaping at render time
 */

// Dangerous patterns that should never appear in user input
const DANGEROUS_PATTERNS = [
    /<script\b[^>]*>/i,                    // Script tags
    /<\/script>/i,                         // Closing script tags
    /javascript:/i,                        // JavaScript protocol
    /on\w+\s*=/i,                         // Event handlers (onclick=, onerror=, etc.)
    /<iframe\b/i,                          // iframes
    /<embed\b/i,                           // embed tags
    /<object\b/i,                          // object tags
    /data:text\/html/i,                    // Data URLs with HTML
    /<svg\b[^>]*\bon\w+=/i,               // SVG with event handlers
    /<math\b/i,                            // Math tags (can be XSS vectors)
    /expression\s*\(/i,                    // CSS expression() 
    /vbscript:/i,                          // VBScript protocol
    /<base\b/i,                            // Base tag manipulation
    /<form\b[^>]*action=/i,               // Form injection
];

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

/**
 * Check if a string contains dangerous patterns
 */
export function containsDangerousPatterns(value: string): boolean {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Validate a string field
 */
export function validateString(
    value: unknown,
    field: string,
    options: { minLength?: number; maxLength?: number; required?: boolean; rejectDangerous?: boolean } = {}
): ValidationError | null {
    const { minLength = 0, maxLength = Infinity, required = true, rejectDangerous = true } = options;

    if (value === undefined || value === null || value === '') {
        if (required) {
            return { field, message: `${field} is required` };
        }
        return null;
    }

    if (typeof value !== 'string') {
        return { field, message: `${field} must be a string` };
    }

    if (value.length < minLength) {
        return { field, message: `${field} must be at least ${minLength} characters` };
    }

    if (value.length > maxLength) {
        return { field, message: `${field} must be ${maxLength} characters or fewer` };
    }

    if (rejectDangerous && containsDangerousPatterns(value)) {
        return { field, message: `${field} contains invalid content` };
    }

    return null;
}

/**
 * Validate a number field
 */
export function validateNumber(
    value: unknown,
    field: string,
    options: { min?: number; max?: number; required?: boolean; integer?: boolean } = {}
): ValidationError | null {
    const { min = -Infinity, max = Infinity, required = true, integer = false } = options;

    if (value === undefined || value === null) {
        if (required) {
            return { field, message: `${field} is required` };
        }
        return null;
    }

    if (typeof value !== 'number' || isNaN(value)) {
        return { field, message: `${field} must be a valid number` };
    }

    if (integer && !Number.isInteger(value)) {
        return { field, message: `${field} must be a whole number` };
    }

    if (value < min) {
        return { field, message: `${field} must be at least ${min}` };
    }

    if (value > max) {
        return { field, message: `${field} must be at most ${max}` };
    }

    return null;
}

/**
 * Validate a date string
 */
export function validateDate(
    value: unknown,
    field: string,
    options: { required?: boolean } = {}
): ValidationError | null {
    const { required = true } = options;

    if (value === undefined || value === null || value === '') {
        if (required) {
            return { field, message: `${field} is required` };
        }
        return null;
    }

    if (typeof value !== 'string') {
        return { field, message: `${field} must be a date string` };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return { field, message: `${field} is not a valid date` };
    }

    return null;
}

// =============================================================================
// ENTITY SCHEMAS
// =============================================================================

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
