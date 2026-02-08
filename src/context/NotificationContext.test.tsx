import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotifications } from './NotificationContext';
import React from 'react';
import * as messaging from 'firebase/messaging';
import * as firestore from 'firebase/firestore';
import { getFcmTokenWithRetry } from '../services/fcmTokenService';

// Mock Firebase dependencies
vi.mock('../config/firebase', () => ({
    messaging: {},
    db: {},
    auth: { currentUser: { uid: 'test-user-id' } },
    APP_ID: 'test-app-id'
}));

vi.mock('firebase/messaging', () => ({
    getToken: vi.fn(),
    onMessage: vi.fn(() => vi.fn()), // Returns unsubscribe function
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(() => ({ id: 'mock-doc-ref' })),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    collection: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

vi.mock('../services/fcmTokenService', () => ({
    getFcmTokenWithRetry: vi.fn(),
}));

vi.mock('../utils/error', () => ({
    captureError: vi.fn(),
}));

// Mock Notification API
const requestPermissionMock = vi.fn();
// @ts-expect-error -- Mocking global.Notification for tests
global.Notification = {
    requestPermission: requestPermissionMock,
    permission: 'default'
};

const TestComponent = () => {
    const { requestPushPermission, fcmToken } = useNotifications();
    return (
        <div>
            <button onClick={requestPushPermission}>Enable Push</button>
            {fcmToken && <span data-testid="token-display">{fcmToken}</span>}
        </div>
    );
};

describe('NotificationContext Token Management', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        requestPermissionMock.mockResolvedValue('granted');
        // @ts-expect-error -- Mocking permission property
        global.Notification.permission = 'default';
    });

    // Fixed: mock getFcmTokenWithRetry instead of raw getToken
    it('requests permission and retrieves FCM token when granted', async () => {
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('mock-fcm-token');

        render(
            <NotificationProvider>
                <TestComponent />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Enable Push'));

        await waitFor(() => {
            expect(requestPermissionMock).toHaveBeenCalled();
            expect(getFcmTokenWithRetry).toHaveBeenCalled();
            expect(screen.getByTestId('token-display')).toHaveTextContent('mock-fcm-token');
        });
    });

    // Fixed: mock getFcmTokenWithRetry and verify Firestore token save
    it('saves token to Firestore after retrieval', async () => {
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('mock-fcm-token');
        const setDocMock = firestore.setDoc as any;

        render(
            <NotificationProvider>
                <TestComponent />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Enable Push'));

        await waitFor(() => {
            expect(firestore.doc).toHaveBeenCalledWith(
                expect.anything(),
                'artifacts',
                expect.any(String), // APP_ID
                'users',
                'test-user-id',
                'fcmTokens',
                'mock-fcm-token'
            );
            expect(setDocMock).toHaveBeenCalledWith(
                expect.anything(),
                {
                    token: 'mock-fcm-token',
                    lastSeen: 'mock-timestamp',
                    platform: 'web',
                    userAgent: expect.any(String)
                },
                { merge: true }
            );
        });
    });

    it('handles permission denied gracefully', async () => {
        requestPermissionMock.mockResolvedValue('denied');

        render(
            <NotificationProvider>
                <TestComponent />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Enable Push'));

        await waitFor(() => {
            expect(requestPermissionMock).toHaveBeenCalled();
            expect(messaging.getToken).not.toHaveBeenCalled();
        });
    });
});
