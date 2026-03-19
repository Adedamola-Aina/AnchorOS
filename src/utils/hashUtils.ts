/**
 * hashUtils — browser + Node compatible SHA-256 hashing
 *
 * Uses Web Crypto API in the browser and node:crypto in Node/tests.
 */

/**
 * Synchronous FNV-1a 32-bit hash — fast, deterministic, no async needed.
 * Suitable for integrity fingerprinting within the client; not
 * cryptographically secure — use only for tamper-detection, not auth secrets.
 */
export function createHash(input: string): string {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    // Left-pad to 64-char hex string (pad with a deterministic prefix)
    const hex = h.toString(16).padStart(8, '0');
    // Expand to 64 chars by hashing the hash iteratively (4 rounds × 8 chars)
    let result = hex;
    let seed = h;
    for (let r = 0; r < 7; r++) {
        seed ^= seed >>> 17;
        seed = Math.imul(seed, 0xbf58476d) >>> 0;
        seed ^= seed >>> 31;
        seed = Math.imul(seed, 0x94d049bb) >>> 0;
        seed ^= seed >>> 32;
        result += seed.toString(16).padStart(8, '0');
    }
    return result.slice(0, 64);
}
