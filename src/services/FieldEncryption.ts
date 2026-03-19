/**
 * FieldEncryption — SEC-005
 *
 * AES-GCM field-level encryption for sensitive financial data (balanceCents, amountCents).
 * Uses the Web Crypto API — works in browser and Node 20+ test environments.
 *
 * Key derivation: PBKDF2 from a passphrase stored in VITE_FIELD_ENCRYPTION_KEY.
 * Each encrypted value gets a random 12-byte IV prepended to the ciphertext.
 *
 * Usage:
 *   const enc = FieldEncryption.fromEnv();
 *   if (enc.isEnabled()) {
 *     const encrypted = await enc.encryptFields(account, ENCRYPTED_ACCOUNT_FIELDS);
 *   }
 */

const ALGO = 'AES-GCM';
const KEY_LEN = 256;
const IV_BYTES = 12;
const SALT = 'anchor-os-field-enc-v1'; // Stable application salt (not secret)
const ITERATIONS = 100_000;

/** Fields to encrypt on AnchorAccount documents */
export const ENCRYPTED_ACCOUNT_FIELDS = ['balanceCents'] as const;

/** Fields to encrypt on AnchorTransaction documents */
export const ENCRYPTED_TRANSACTION_FIELDS = ['amountCents'] as const;

async function deriveKey(passphrase: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
        'raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: encoder.encode(SALT), iterations: ITERATIONS, hash: 'SHA-256' },
        baseKey,
        { name: ALGO, length: KEY_LEN },
        false,
        ['encrypt', 'decrypt']
    );
}

function toBase64(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string): Uint8Array {
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export class FieldEncryption {
    private readonly passphrase: string;
    private keyCache: CryptoKey | null = null;

    constructor(passphrase: string) {
        this.passphrase = passphrase;
    }

    static fromEnv(): FieldEncryption {
        const key = (typeof import.meta !== 'undefined'
            ? (import.meta as { env?: Record<string, string> }).env?.VITE_FIELD_ENCRYPTION_KEY
            : process.env.VITE_FIELD_ENCRYPTION_KEY) ?? '';
        return new FieldEncryption(key);
    }

    isEnabled(): boolean {
        return this.passphrase.length > 0;
    }

    private async getKey(): Promise<CryptoKey> {
        if (!this.keyCache) {
            this.keyCache = await deriveKey(this.passphrase);
        }
        return this.keyCache;
    }

    /** Encrypt a value to a base64 string (IV:ciphertext). */
    async encrypt(value: string | number): Promise<string> {
        const key = await this.getKey();
        const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
        const encoded = new TextEncoder().encode(String(value));
        const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, encoded);
        const combined = new Uint8Array(IV_BYTES + ciphertext.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(ciphertext), IV_BYTES);
        return toBase64(combined.buffer);
    }

    /** Decrypt a base64 string back to the original value string. */
    async decrypt(ciphertext: string): Promise<string> {
        const key = await this.getKey();
        const combined = fromBase64(ciphertext);
        const iv = combined.slice(0, IV_BYTES);
        const data = combined.slice(IV_BYTES);
        const plaintext = await crypto.subtle.decrypt({ name: ALGO, iv }, key, data);
        return new TextDecoder().decode(plaintext);
    }

    /** Encrypt listed fields in a document, leave others untouched. */
    async encryptFields<T extends Record<string, unknown>>(
        doc: T,
        fields: readonly (keyof T)[]
    ): Promise<T> {
        const result = { ...doc };
        for (const field of fields) {
            if (field in result && result[field] != null) {
                (result as Record<keyof T, unknown>)[field] = await this.encrypt(result[field] as string | number);
            }
        }
        return result;
    }

    /** Decrypt listed fields in a document, leave others untouched. */
    async decryptFields<T extends Record<string, string | unknown>>(
        doc: T,
        fields: readonly (keyof T)[]
    ): Promise<T> {
        const result = { ...doc };
        for (const field of fields) {
            if (field in result && typeof result[field] === 'string') {
                (result as Record<keyof T, unknown>)[field] = await this.decrypt(result[field] as string);
            }
        }
        return result;
    }
}
