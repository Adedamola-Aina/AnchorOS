/**
 * passkeyUtils — AUTH-002, GAP-011
 *
 * Shared constants and encoding helpers for WebAuthn passkey operations.
 */

export const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'anchor-os.web.app';
export const RP_NAME = 'Anchor OS';

export function bufferToBase64url(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function base64urlToBuffer(b64: string): Uint8Array<ArrayBuffer> {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const len = binary.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) buf[i] = binary.charCodeAt(i);
    return buf;
}
