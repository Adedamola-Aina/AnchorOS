/**
 * MFA Recovery Codes Service
 * 
 * FEAT-002: Generate and manage backup recovery codes for MFA.
 * Codes are displayed once at enrollment, stored as SHA-256 hashes.
 */

const CODE_LENGTH = 8;
const CODE_COUNT = 8;
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0/O/1/I confusion

function generateCode(): string {
    const array = new Uint8Array(CODE_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => CHARSET[b % CHARSET.length]).join('');
}

async function hashCode(code: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(code.toUpperCase().replace(/\s/g, ''));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface RecoveryCodesResult {
    /** Plain-text codes to show to user ONCE */
    plainCodes: string[];
    /** SHA-256 hashed codes for Firestore storage */
    hashedCodes: string[];
}

/**
 * Generate a set of one-time recovery codes.
 * Plain codes must be shown to user immediately — they cannot be recovered.
 */
export async function generateRecoveryCodes(): Promise<RecoveryCodesResult> {
    const plainCodes = Array.from({ length: CODE_COUNT }, () => generateCode());
    const hashedCodes = await Promise.all(plainCodes.map(hashCode));
    return { plainCodes, hashedCodes };
}

/**
 * Verify a recovery code against stored hashes.
 * Returns the index of the matched code, or -1 if not found.
 */
export async function verifyRecoveryCode(
    code: string,
    storedHashes: string[],
): Promise<number> {
    const hash = await hashCode(code);
    return storedHashes.indexOf(hash);
}
