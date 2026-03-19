/**
 * FieldEncryption — SEC-005
 * Tests: encrypt/decrypt financial fields before Firestore writes
 */

import { describe, it, expect } from 'vitest';
import { FieldEncryption } from './FieldEncryption';

const KEY = 'test-encryption-key-32-chars-ok!';

describe('FieldEncryption', () => {
    it('encrypts and decrypts a number', async () => {
        const enc = new FieldEncryption(KEY);
        const ciphertext = await enc.encrypt(5000);
        expect(typeof ciphertext).toBe('string');
        expect(ciphertext).not.toBe('5000');
        const decrypted = await enc.decrypt(ciphertext);
        expect(decrypted).toBe('5000');
    });

    it('produces different ciphertext for same input (random IV)', async () => {
        const enc = new FieldEncryption(KEY);
        const a = await enc.encrypt(5000);
        const b = await enc.encrypt(5000);
        expect(a).not.toBe(b);
    });

    it('encryptFields encrypts specified keys in an object', async () => {
        const enc = new FieldEncryption(KEY);
        const result = await enc.encryptFields(
            { balanceCents: 10000, name: 'Savings', type: 'savings' },
            ['balanceCents']
        );
        expect(typeof result['balanceCents']).toBe('string');
        expect(result['name']).toBe('Savings');
        expect(result['type']).toBe('savings');
    });

    it('decryptFields decrypts specified keys in an object', async () => {
        const enc = new FieldEncryption(KEY);
        const encrypted = await enc.encryptFields({ balanceCents: 10000 }, ['balanceCents']);
        const decrypted = await enc.decryptFields(encrypted as Record<string, string>, ['balanceCents']);
        expect(decrypted['balanceCents']).toBe('10000');
    });

    it('throws if wrong key is used for decryption', async () => {
        const enc1 = new FieldEncryption(KEY);
        const enc2 = new FieldEncryption('wrong-key-32-chars-padding-here!');
        const ciphertext = await enc1.encrypt(5000);
        await expect(enc2.decrypt(ciphertext)).rejects.toThrow();
    });

    it('isEnabled returns false when no key configured', () => {
        const enc = new FieldEncryption('');
        expect(enc.isEnabled()).toBe(false);
    });
});
