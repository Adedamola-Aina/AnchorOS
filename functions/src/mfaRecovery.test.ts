import { describe, expect, it } from 'vitest';
import { consumeRecoveryCode, hashRecoveryCode, normalizeRecoveryCode } from './mfaRecovery';

describe('mfaRecovery', () => {
    it('normalizes recovery code input', () => {
        expect(normalizeRecoveryCode('ab-cd 1234')).toBe('ABCD1234');
    });

    it('hashes normalized recovery codes and verifies correctly', async () => {
        const hash = await hashRecoveryCode('ABCD1234');
        expect(hash).toMatch(/^\$2/); // bcrypt hash prefix
        const result = await consumeRecoveryCode([hash], 'ABCD1234');
        expect(result).toEqual([]);
    });

    it('removes matched hash and returns remaining list', async () => {
        const hashA = await hashRecoveryCode('ABCD1234');
        const hashB = await hashRecoveryCode('WXYZ6789');
        const result = await consumeRecoveryCode([hashA, hashB], 'ABCD1234');
        // remaining list has one entry (the hash for WXYZ6789); compare by verifying it
        expect(result).toHaveLength(1);
        const verified = await consumeRecoveryCode(result!, 'WXYZ6789');
        expect(verified).toEqual([]);
    });

    it('returns null when code does not match', async () => {
        const hashA = await hashRecoveryCode('ABCD1234');
        const hashB = await hashRecoveryCode('WXYZ6789');
        const result = await consumeRecoveryCode([hashA, hashB], 'QQQQ1111');
        expect(result).toBeNull();
    });
});
