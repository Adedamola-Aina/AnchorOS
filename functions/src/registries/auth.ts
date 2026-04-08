import type { CallableRegistryEntry } from '../callableRegistry';

export const authRegistry: ReadonlyArray<CallableRegistryEntry> = [
    // ── Auth Events ──────────────────────────────
    {
        name: 'dismissAuthEvent',
        version: 1,
        description: 'Dismiss an auth event from the security log',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },
    {
        name: 'recordAuthEvent',
        version: 1,
        description: 'Record a sign-in or security event for audit history',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },
    {
        name: 'reportUnrecognisedSignIn',
        version: 1,
        description: 'Flag a sign-in event as unrecognised by the user',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },

    // ── MFA ──────────────────────────────────────
    {
        name: 'recoverMfaWithCode',
        version: 1,
        description: 'MFA recovery using backup code',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'mfaRecovery',
        status: 'stable',
        domain: 'mfa',
    },

    // ── Email Change ─────────────────────────────
    {
        name: 'syncEmailToProfile',
        version: 1,
        description: 'Sync Firebase Auth email change to Firestore profile',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'emailSync',
        status: 'stable',
        domain: 'auth',
    },

    // ── Session Management ───────────────────────
    {
        name: 'listActiveSessions',
        version: 1,
        description: 'List active sign-in sessions for the current user',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },
    {
        name: 'revokeSession',
        version: 1,
        description: 'Revoke a specific sign-in session by event ID',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'revokeSession',
        status: 'stable',
        domain: 'auth',
    },
];
