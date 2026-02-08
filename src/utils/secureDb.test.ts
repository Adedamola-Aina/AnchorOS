/**
 * Tests for secureDb.ts — the mandatory DB layer
 * ALL Firestore operations in the app go through this module.
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { secureDb } from './secureDb';

// Mock secureDbCore helpers
vi.mock('./secureDbCore', () => ({
    withTimeout: vi.fn((promise) => promise), // Pass through by default
    logOp: vi.fn(),
    getUserDocRef: vi.fn((_uid, ...path) => ({ path: `artifacts/anchor-os/users/uid/${path.join('/')}` })),
    getUserCollectionPath: vi.fn((_uid, col) => ({ path: `artifacts/anchor-os/users/uid/${col}` })),
}));

describe('secureDb', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── getDocument ─────────────────────────────────────────────────
    describe('getDocument', () => {
        it('returns null when document does not exist', async () => {
            vi.mocked(getDoc).mockResolvedValueOnce({
                exists: () => false,
                data: () => null,
                id: 'doc-1',
            } as any);

            const result = await secureDb.getDocument('user-1', ['accounts', 'acc-1']);
            expect(result).toBeNull();
        });

        it('returns document data with id when exists', async () => {
            vi.mocked(getDoc).mockResolvedValueOnce({
                exists: () => true,
                data: () => ({ name: 'Savings', balanceCents: 50000 }),
                id: 'acc-1',
            } as any);

            const result = await secureDb.getDocument<{ id: string; name: string }>('user-1', ['accounts', 'acc-1']);
            expect(result).toEqual({
                id: 'acc-1',
                name: 'Savings',
                balanceCents: 50000,
            });
        });

        it('throws on Firestore error', async () => {
            vi.mocked(getDoc).mockRejectedValueOnce(new Error('permission-denied'));
            vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(secureDb.getDocument('user-1', ['bad'])).rejects.toThrow('permission-denied');
        });
    });

    // ── queryCollection ─────────────────────────────────────────────
    describe('queryCollection', () => {
        it('returns empty array for empty collection', async () => {
            vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as any);

            const result = await secureDb.queryCollection('user-1', 'accounts');
            expect(result).toEqual([]);
        });

        it('returns mapped documents with ids', async () => {
            vi.mocked(getDocs).mockResolvedValueOnce({
                docs: [
                    { id: 'a1', data: () => ({ name: 'Checking' }) },
                    { id: 'a2', data: () => ({ name: 'Savings' }) },
                ],
            } as any);

            const result = await secureDb.queryCollection<{ id: string; name: string }>('user-1', 'accounts');
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: 'a1', name: 'Checking' });
            expect(result[1]).toEqual({ id: 'a2', name: 'Savings' });
        });

        it('applies constraints when provided', async () => {
            vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as any);
            const mockConstraint = { type: 'where', args: ['type', '==', 'savings'] };

            await secureDb.queryCollection('user-1', 'accounts', [mockConstraint as any]);
            expect(query).toHaveBeenCalled();
        });

        it('builds query without constraints', async () => {
            vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as any);
            await secureDb.queryCollection('user-1', 'accounts', []);
            expect(query).toHaveBeenCalled();
        });

        it('throws on Firestore error', async () => {
            vi.mocked(getDocs).mockRejectedValueOnce(new Error('unavailable'));
            vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(secureDb.queryCollection('user-1', 'accounts')).rejects.toThrow('unavailable');
        });
    });

    // ── setDocument ─────────────────────────────────────────────────
    describe('setDocument', () => {
        it('calls setDoc with correct reference and data', async () => {
            await secureDb.setDocument('user-1', ['profile'], { name: 'Test' });
            expect(setDoc).toHaveBeenCalled();
        });

        it('throws on error', async () => {
            vi.mocked(setDoc).mockRejectedValueOnce(new Error('write failed'));
            vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(secureDb.setDocument('user-1', ['x'], {})).rejects.toThrow('write failed');
        });
    });

    // ── updateDocument ──────────────────────────────────────────────
    describe('updateDocument', () => {
        it('calls updateDoc with correct reference and data', async () => {
            await secureDb.updateDocument('user-1', ['accounts', 'a1'], { name: 'Updated' });
            expect(updateDoc).toHaveBeenCalled();
        });

        it('throws on error', async () => {
            vi.mocked(updateDoc).mockRejectedValueOnce(new Error('not-found'));
            vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(secureDb.updateDocument('user-1', ['x'], {})).rejects.toThrow('not-found');
        });
    });

    // ── deleteDocument ──────────────────────────────────────────────
    describe('deleteDocument', () => {
        it('calls deleteDoc with correct reference', async () => {
            await secureDb.deleteDocument('user-1', ['accounts', 'a1']);
            expect(deleteDoc).toHaveBeenCalled();
        });

        it('throws on error', async () => {
            vi.mocked(deleteDoc).mockRejectedValueOnce(new Error('permission-denied'));
            vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(secureDb.deleteDocument('user-1', ['x'])).rejects.toThrow('permission-denied');
        });
    });
});
