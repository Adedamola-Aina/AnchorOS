import type { CallableRegistryEntry } from '../callableRegistry';

export const securityRegistry: ReadonlyArray<CallableRegistryEntry> = [
    {
        name: 'verifyDeviceAttestation',
        version: 1,
        description: 'Verify device attestation via App Check (Phase 1: App Check; Phase 2: Play Integrity / DeviceCheck)',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'deviceAttestation',
        status: 'beta',
        domain: 'security',
    },
];
