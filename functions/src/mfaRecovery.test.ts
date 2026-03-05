import { describe, expect, it } from 'vitest';
import { consumeRecoveryCodeHash, hashRecoveryCode, normalizeRecoveryCode } from './mfaRecovery';

describe('mfaRecovery', () => {
    it('normalizes recovery code input', () => {
        expect(normalizeRecoveryCode('ab-cd 1234')).toBe('ABCD1234');
    });

    it('hashes normalized recovery codes deterministically', () => {
        const hashA = hashRecoveryCode('ABCD1234');
        const hashB = hashRecoveryCode('ABCD1234');
        expect(hashA).toBe(hashB);
    });

    it('removes matched hash and returns remaining list', () => {
        const a = hashRecoveryCode('ABCD1234');
        const b = hashRecoveryCode('WXYZ6789');
        expect(consumeRecoveryCodeHash([a, b], a)).toEqual([b]);
    });

    it('returns null when hash does not match', () => {
        const a = hashRecoveryCode('ABCD1234');
        const b = hashRecoveryCode('WXYZ6789');
        const c = hashRecoveryCode('QQQQ1111');
        expect(consumeRecoveryCodeHash([a, b], c)).toBeNull();
    });
});
