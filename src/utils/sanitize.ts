/**
 * Sanitization Utilities
 * 
 * HTML entity encoding for defense-in-depth XSS protection.
 * React already escapes output, but this adds an extra layer of safety
 * for data that might be used in non-React contexts (emails, exports, etc).
 */

/**
 * Encode HTML special characters to prevent XSS.
 * Skips already-encoded entities to prevent double-encoding.
 */
export const encodeHtml = (str: string): string => {
    if (typeof str !== 'string') return str;
    // First decode any existing entities to normalize, then re-encode once
    const decoded = str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");
    return decoded
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

/**
 * Decode HTML entities back to original characters
 */
export const decodeHtml = (str: string): string => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");
};

/**
 * Recursively sanitize all string fields in an object
 */
export const sanitizeObject = <T extends object>(obj: T): T => {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
        return obj.map(item =>
            typeof item === 'object' ? sanitizeObject(item) :
                typeof item === 'string' ? encodeHtml(item) : item
        ) as T;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = encodeHtml(value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value as object);
        } else {
            result[key] = value;
        }
    }

    return result as T;
};

/**
 * Strip all HTML tags from a string (multi-pass to prevent nested-tag reassembly)
 */
export const stripHtml = (str: string): string => {
    if (typeof str !== 'string') return str;
    let prev = str;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const next = prev.replace(/<[^>]*>/g, '');
        if (next === prev) return next;
        prev = next;
    }
};

/**
 * Sanitize a URL to prevent javascript: protocol attacks
 */
export const sanitizeUrl = (url: string): string => {
    if (typeof url !== 'string') return '';

    const trimmed = url.trim().toLowerCase();

    // Block dangerous protocols
    if (trimmed.startsWith('javascript:') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('vbscript:')) {
        return '';
    }

    return url;
};
