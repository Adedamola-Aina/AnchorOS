import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * RA-11 (#167): Settings must expose verification status and a resend action.
 */
const mockState = vi.hoisted(() => ({
    verified: false,
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    reload: vi.fn().mockResolvedValue(undefined),
    showToast: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({
        user: { email: 'owner@test.com', emailVerified: mockState.verified, reload: mockState.reload },
        sendVerificationEmail: mockState.sendVerificationEmail,
    }),
}));

vi.mock('../../../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: mockState.showToast }),
}));

import { EmailVerificationCard } from './EmailVerificationCard';

describe('EmailVerificationCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.verified = false;
    });

    it('shows unverified status and resends the verification email', async () => {
        render(<EmailVerificationCard />);

        expect(screen.getByTestId('email-verification-status')).toHaveTextContent('Not verified');

        await userEvent.click(screen.getByRole('button', { name: /resend verification email/i }));

        expect(mockState.sendVerificationEmail).toHaveBeenCalledTimes(1);
        expect(mockState.showToast).toHaveBeenCalledWith('Verification email sent!', 'success');
    });

    it('shows verified status without a resend action', () => {
        mockState.verified = true;

        render(<EmailVerificationCard />);

        expect(screen.getByTestId('email-verification-status')).toHaveTextContent('Verified');
        expect(screen.queryByRole('button', { name: /resend verification email/i })).toBeNull();
    });

    it('re-reads the account when the user confirms they clicked the link', async () => {
        render(<EmailVerificationCard />);

        await userEvent.click(screen.getByRole('button', { name: /i've verified/i }));

        expect(mockState.reload).toHaveBeenCalledTimes(1);
    });
});