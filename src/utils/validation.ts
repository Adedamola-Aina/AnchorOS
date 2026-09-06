/**
 * Input Validation Utilities
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Entity validation schemas moved to entityValidation.ts
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
        if (required) return { field, message: `${field} is required` };
        return null;
    }

    if (typeof value !== 'string') return { field, message: `${field} must be a string` };
    if (value.length < minLength) return { field, message: `${field} must be at least ${minLength} characters` };
    if (value.length > maxLength) return { field, message: `${field} must be ${maxLength} characters or fewer` };
    if (rejectDangerous && containsDangerousPatterns(value)) return { field, message: `${field} contains invalid content` };

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
        if (required) return { field, message: `${field} is required` };
        return null;
    }

    if (typeof value !== 'number' || isNaN(value)) return { field, message: `${field} must be a valid number` };
    if (integer && !Number.isInteger(value)) return { field, message: `${field} must be a whole number` };
    if (value < min) return { field, message: `${field} must be at least ${min}` };
    if (value > max) return { field, message: `${field} must be at most ${max}` };

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
        if (required) return { field, message: `${field} is required` };
        return null;
    }

    if (typeof value !== 'string') return { field, message: `${field} must be a date string` };
    const date = new Date(value);
    if (isNaN(date.getTime())) return { field, message: `${field} is not a valid date` };

    return null;
}

// Re-export entity schemas for backward compatibility
export {
    validateAccount, validateTransaction, formatValidationErrors
} from './entityValidation';
