/**
 * LedgerService — ARCH-022
 * Tests: financial mutation audit ledger
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/secureDb', () => ({
    secureDb: {
        setDocument: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('../config/firebase', () => ({ APP_ID: 'anchor-os' }));

import { LedgerService } from './LedgerService';
import { secureDb } from '../utils/secureDb';

const UID = 'user-123';

describe('LedgerService', () => {
    beforeEach(() => vi.clearAllMocks());

    it('writes a ledger entry on transaction_created', async () => {
        await LedgerService.record(UID, {
            action: 'transaction_created',
            entityId: 'tx-1',
            entityType: 'transaction',
            amountCentsDelta: 5000,
            snapshotAfter: { id: 'tx-1', amountCents: 5000, type: 'expense' },
        });
        expect(secureDb.setDocument).toHaveBeenCalledTimes(1);
        const [userId, path] = vi.mocked(secureDb.setDocument).mock.calls[0];
        expect(userId).toBe(UID);
        expect(path[0]).toBe('ledger');
    });

    it('includes integrityHash in the written document', async () => {
        await LedgerService.record(UID, {
            action: 'account_created',
            entityId: 'acc-1',
            entityType: 'account',
            amountCentsDelta: 0,
            snapshotAfter: { id: 'acc-1', name: 'Checking' },
        });
        const data = vi.mocked(secureDb.setDocument).mock.calls[0][2];
        expect(typeof data['integrityHash']).toBe('string');
        expect((data['integrityHash'] as string).length).toBe(64);
    });

    it('stores action, entityId, entityType, actorUid', async () => {
        await LedgerService.record(UID, {
            action: 'transaction_deleted',
            entityId: 'tx-99',
            entityType: 'transaction',
            amountCentsDelta: -2000,
            snapshotBefore: { id: 'tx-99' },
            snapshotAfter: null,
        });
        const data = vi.mocked(secureDb.setDocument).mock.calls[0][2];
        expect(data['action']).toBe('transaction_deleted');
        expect(data['entityId']).toBe('tx-99');
        expect(data['entityType']).toBe('transaction');
        expect(data['actorUid']).toBe(UID);
    });

    it('silently fails and does not throw on DB error', async () => {
        vi.mocked(secureDb.setDocument).mockRejectedValueOnce(new Error('DB error'));
        await expect(
            LedgerService.record(UID, {
                action: 'transaction_created',
                entityId: 'tx-1',
                entityType: 'transaction',
                amountCentsDelta: 100,
                snapshotAfter: {},
            })
        ).resolves.not.toThrow();
    });

    it('generates a unique ledger doc ID per call', async () => {
        await LedgerService.record(UID, { action: 'transaction_created', entityId: 'a', entityType: 'transaction', amountCentsDelta: 1, snapshotAfter: {} });
        await LedgerService.record(UID, { action: 'transaction_created', entityId: 'b', entityType: 'transaction', amountCentsDelta: 2, snapshotAfter: {} });
        const id1 = vi.mocked(secureDb.setDocument).mock.calls[0][1][1];
        const id2 = vi.mocked(secureDb.setDocument).mock.calls[1][1][1];
        expect(id1).not.toBe(id2);
    });
});
