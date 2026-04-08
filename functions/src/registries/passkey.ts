import type { CallableRegistryEntry } from '../callableRegistry';

export const passkeyRegistry: ReadonlyArray<CallableRegistryEntry> = [
    {
        name: 'completePasskeyRegistration',
        version: 1,
        description: 'Complete passkey registration with attestation verification',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
    {
        name: 'deletePasskey',
        version: 1,
        description: 'Delete a registered passkey',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
    {
        name: 'issuePasskeyChallenge',
        version: 1,
        description: 'Issue a WebAuthn challenge for passkey sign-in',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
    {
        name: 'verifyPasskeyAssertion',
        version: 1,
        description: 'Verify a WebAuthn assertion for passkey sign-in',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
];
