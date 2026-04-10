import { describe, it, expect } from 'vitest';
import { CALLABLE_CONTRACTS, getCallableNamesFromRegistry, validateCallableContract } from './callableContracts';

describe('callableContracts', () => {
    it('has a contract entry for every callable in the registry', () => {
        const callableNames = getCallableNamesFromRegistry();
        const contractNames = Object.keys(CALLABLE_CONTRACTS).sort();

        const missing = callableNames.filter((name) => !contractNames.includes(name));
        const orphaned = contractNames.filter((name) => !callableNames.includes(name));

        expect(missing, `Missing contracts: ${missing.join(', ')}`).toEqual([]);
        expect(orphaned, `Orphaned contracts: ${orphaned.join(', ')}`).toEqual([]);
    });

    it('validates strict request/response required fields', () => {
        expect(
            validateCallableContract('checkRateLimit', { bucket: 'transactionCreate' }, { allowed: true })
        ).toEqual([]);
        expect(
            validateCallableContract('health', {}, { ok: true })
        ).toEqual([]);
    });

    it('fails validation when required fields are missing', () => {
        const errors = validateCallableContract('checkRateLimit', {}, {});
        expect(errors).toEqual(expect.arrayContaining([
            'request: Missing required field: bucket',
            'response: Missing required field: allowed',
        ]));
    });

    it('fails validation when payloads are non-objects', () => {
        const errors = validateCallableContract('resetRateLimit', 'bad-request', null);
        expect(errors).toEqual(expect.arrayContaining([
            'request: Payload must be an object',
            'response: Payload must be an object',
        ]));
    });
});
