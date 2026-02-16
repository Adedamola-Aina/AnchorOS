/**
 * SettingsDataActions — handleWipeData, handleDeleteAccount
 * Target: 80%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase modules with dynamic import support
const mockGetDocs = vi.fn();
const mockWriteBatch = vi.fn();
const mockDoc = vi.fn((..._a: any[]) => 'mock-doc-ref');
const mockCollection = vi.fn((..._a: any[]) => 'mock-col-ref');
const mockDeleteUser = vi.fn();

vi.mock('firebase/firestore', () => ({
    getDocs: (...a: any[]) => mockGetDocs(...a),
    collection: (...a: any[]) => mockCollection(...a),
    writeBatch: (...a: any[]) => mockWriteBatch(...a),
    doc: (...a: any[]) => mockDoc(...a),
}));

vi.mock('firebase/auth', () => ({
    deleteUser: (...a: any[]) => mockDeleteUser(...a),
}));

vi.mock('../../../config/firebase', () => ({
    db: {},
    APP_ID: 'test-app',
}));

vi.mock('../../../utils/error', () => ({
    captureError: vi.fn(),
}));

import { handleWipeData, handleDeleteAccount } from './SettingsDataActions';

describe('handleWipeData', () => {
    const showToast = vi.fn();
    const mockCommit = vi.fn(() => Promise.resolve());
    const mockBatchDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockWriteBatch.mockReturnValue({
            delete: mockBatchDelete,
            commit: mockCommit,
        });
    });

    it('deletes all documents across 5 collections', async () => {
        // Each collections returns 2 docs
        mockGetDocs.mockResolvedValue({
            docs: [
                { id: 'doc-1' },
                { id: 'doc-2' },
            ],
        });

        // Mock window.location.reload
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            configurable: true,
        });

        await handleWipeData('user-1', showToast);

        // 5 collections × 2 docs = 10 total
        expect(showToast).toHaveBeenCalledWith('Wiped 10 records.', 'success');
    });

    it('shows info toast when nothing to wipe', async () => {
        mockGetDocs.mockResolvedValue({ docs: [] });

        await handleWipeData('user-1', showToast);

        expect(showToast).toHaveBeenCalledWith('Nothing to wipe.', 'info');
    });

    it('shows error toast on failure', async () => {
        mockGetDocs.mockRejectedValue(new Error('network'));

        await handleWipeData('user-1', showToast);

        expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Wipe failed'), 'error');
    });
});

describe('handleDeleteAccount', () => {
    const showToast = vi.fn();
    const mockLogout = vi.fn();
    const mockDisconnectFamily = vi.fn(() => Promise.resolve());
    const mockCommit = vi.fn(() => Promise.resolve());
    const mockBatchDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockWriteBatch.mockReturnValue({
            delete: mockBatchDelete,
            commit: mockCommit,
        });
        mockGetDocs.mockResolvedValue({ docs: [] });
    });

    it('deletes user data and Firebase auth account', async () => {
        mockDeleteUser.mockResolvedValue(undefined);

        await handleDeleteAccount(
            { uid: 'user-1' } as any,
            null,
            mockDisconnectFamily,
            mockLogout,
            showToast
        );

        expect(mockDeleteUser).toHaveBeenCalled();
        expect(showToast).toHaveBeenCalledWith('Account deleted successfully.', 'success');

        // Logout after delay
        vi.advanceTimersByTime(500);
        expect(mockLogout).toHaveBeenCalled();
    });

    it('disconnects family before deletion when connected', async () => {
        mockDeleteUser.mockResolvedValue(undefined);

        await handleDeleteAccount(
            { uid: 'user-1' } as any,
            { id: 'conn-1' }, // has family connection
            mockDisconnectFamily,
            mockLogout,
            showToast
        );

        expect(mockDisconnectFamily).toHaveBeenCalledWith('leave');
    });

    it('handles requires-recent-login gracefully', async () => {
        mockDeleteUser.mockRejectedValue({ code: 'auth/requires-recent-login' });

        await handleDeleteAccount(
            { uid: 'user-1' } as any,
            null,
            mockDisconnectFamily,
            mockLogout,
            showToast
        );

        expect(showToast).toHaveBeenCalledWith(
            'Account data deleted. Sign in again to complete deletion.',
            'info'
        );
    });

    it('throws error when no user ID', async () => {
        await handleDeleteAccount(
            null,
            null,
            mockDisconnectFamily,
            mockLogout,
            showToast
        );

        expect(showToast).toHaveBeenCalledWith(expect.stringContaining('No user ID'), 'error');
    });

    it('shows error toast on unexpected failure', async () => {
        mockDeleteUser.mockRejectedValue(new Error('unexpected'));

        await handleDeleteAccount(
            { uid: 'user-1' } as any,
            null,
            mockDisconnectFamily,
            mockLogout,
            showToast
        );

        expect(showToast).toHaveBeenCalledWith(expect.stringContaining('unexpected'), 'error');
    });

    afterEach(() => {
        vi.useRealTimers();
    });
});
