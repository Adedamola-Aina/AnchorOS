export interface TokenDocumentRef {
    delete: () => Promise<unknown>;
}

const STALE_TOKEN_ERROR_CODES = new Set([
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
]);

export function isStaleTokenError(code?: string): boolean {
    if (!code) {
        return false;
    }

    return STALE_TOKEN_ERROR_CODES.has(code);
}

export async function removeTokenIfStale(
    code: string | undefined,
    token: string,
    tokenDoc: TokenDocumentRef,
): Promise<boolean> {
    if (!isStaleTokenError(code)) {
        return false;
    }

    await tokenDoc.delete();
    console.warn(`[Reminders] Removed stale token: ${token.substring(0, 10)}...`);
    return true;
}
