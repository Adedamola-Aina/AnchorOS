/**
 * AccountDetailsView rename regression tests (Issue #142 follow-up).
 *
 * These tests deliberately use the REAL shared Modal (no vi.mock) so keyboard
 * handling (Escape, Tab focus trap, disabled exclusion, focus restore) is
 * exercised against the same component the app renders.
 *
 * Recovery semantics are guaranteed by AccountService.renameAccount, which
 * commits the account document (name + history) LAST, after every
 * transaction-update batch. A partial failure therefore never changes the
 * account snapshot, so retrying the submitted name — or choosing any other
 * name, including the original — always re-runs the service path. The UI
 * tests here assert the contract: failure keeps the modal open with the
 * entered text and never reports success; retry reuses the same service call.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { AccountDetailsView } from './AccountDetailsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContext } from '../../context/AnchorContext';
import { FinanceContext } from '../../context/FinanceContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import type { AnchorAccount, AnchorTransaction, UserProfile } from '../../types';

type FinanceValue = NonNullable<ComponentProps<typeof FinanceContext.Provider>['value']>;
type AppValue = NonNullable<ComponentProps<typeof AppContext.Provider>['value']>;
type AuthValue = NonNullable<ComponentProps<typeof AuthContext.Provider>['value']>;
type NotificationValue = NonNullable<ComponentProps<typeof NotificationContext.Provider>['value']>;
type RenameFn = FinanceValue['renameAccount'];

const mockAccount: AnchorAccount = {
    id: 'acc-1',
    name: 'Checking Account',
    type: 'checking',
    currency: 'USD',
    balanceCents: 500000,
    color: 'bg-blue-500',
    scope: 'personal',
};

const mockTransactions: AnchorTransaction[] = [
    {
        id: 'tx-1',
        title: 'Grocery Shopping',
        amountCents: 15050,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        accountName: 'Checking Account',
        currency: 'USD',
        scope: 'personal',
        date: new Date().toISOString(),
    },
];

const mockProfile: UserProfile = {
    name: 'Test User',
    familyMode: false,
    theme: 'light',
};

const noopAsync = (): Promise<void> => Promise.resolve();

interface Harness {
    renameAccount: ReturnType<typeof vi.fn<RenameFn>>;
    showToast: ReturnType<typeof vi.fn<NotificationValue['showToast']>>;
}

const renderView = (account: AnchorAccount = mockAccount, overrides: { renameAccount?: RenameFn } = {}): Harness => {
    const renameAccount = vi.fn<RenameFn>(overrides.renameAccount ?? ((): Promise<void> => Promise.resolve()));
    const showToast = vi.fn<NotificationValue['showToast']>();
    const finance: FinanceValue = {
        transactions: mockTransactions,
        accounts: [account],
        loadingFinance: false,
        addAccount: noopAsync,
        deleteAccount: noopAsync,
        updateAccountPersonalization: noopAsync,
        addTransaction: noopAsync,
        deleteTransaction: noopAsync,
        restoreTransaction: noopAsync,
        convertCurrency: noopAsync,
        renameAccount,
        updateTransaction: noopAsync,
        currentMonth: new Date(),
        nextMonth: vi.fn(),
        prevMonth: vi.fn(),
        jumpToMonth: vi.fn(),
        netWorth: { NGN: 0, USD: 0 },
        recentActivity: [],
        cashFlow: { income: 0, expense: 0, net: 0, trend: 'neutral' },
        refetch: noopAsync,
    };
    const app: AppValue = { navigateTo: vi.fn(), activeTab: 'finance' };
    const auth: AuthValue = {
        user: null,
        profile: mockProfile,
        loading: false,
        profileLoaded: true,
        updateProfile: noopAsync,
        signIn: noopAsync,
        signUp: noopAsync,
        signInWithGoogle: () => Promise.resolve(null),
        signInWithApple: () => Promise.resolve(null),
        logout: noopAsync,
        sendVerificationEmail: noopAsync,
        accountNotifications: [],
        verifyMfa: noopAsync,
        generateMfaSecret: () => Promise.resolve({ qrCodeUrl: '', manualKey: '' }),
        enrollMfa: noopAsync,
        unenrollMfa: noopAsync,
        reauthenticate: noopAsync,
        reauthenticateWithProvider: noopAsync,
        sendPasswordReset: noopAsync,
    };
    const notifications: NotificationValue = {
        showToast,
        confirm: () => Promise.resolve(true),
        requestPushPermission: () => Promise.resolve(null),
        fcmToken: null,
        pushPermissionStatus: 'default',
    };

    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <AuthContext.Provider value={auth}>
                <AppContext.Provider value={app}>
                    <FinanceContext.Provider value={finance}>
                        <NotificationContext.Provider value={notifications}>
                            <AccountDetailsView account={account} onBack={vi.fn()} />
                        </NotificationContext.Provider>
                    </FinanceContext.Provider>
                </AppContext.Provider>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
    return { renameAccount, showToast };
};

const openRenameModal = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByLabelText('Account options'));
    await user.click(screen.getByText('Edit Account'));
    return screen.getByRole('dialog');
};

describe('AccountDetailsView rename — failure recovery', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 600 });
    });

    it('a failed rename never reports success and the same name can be retried', async () => {
        // First attempt rejects (e.g. a transaction batch failed); because the
        // service commits the account document last, the live snapshot still
        // shows the original name, so this UI must allow the retry.
        const renameAccount = vi.fn<RenameFn>()
            .mockImplementationOnce(() => Promise.reject(new Error('batch failed')))
            .mockImplementation((): Promise<void> => Promise.resolve());
        const harness = renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(harness.showToast).toHaveBeenCalledWith('Unable to rename account right now', 'error'));
        // No success is claimed while required updates are incomplete.
        expect(harness.showToast).not.toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
        // Modal stays open with the entered text preserved.
        expect(screen.getByText('Rename Account')).toBeInTheDocument();
        expect(input).toHaveValue('Main Checking');

        // Retry the same entered name through the same service path.
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(2));
        expect(harness.renameAccount).toHaveBeenLastCalledWith('acc-1', 'Main Checking');
        await waitFor(() => expect(screen.queryByText('Rename Account')).not.toBeInTheDocument());
        expect(harness.showToast).toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
    });

    it('after a failure, choosing a different name also retries', async () => {
        const renameAccount = vi.fn<RenameFn>()
            .mockImplementationOnce(() => Promise.reject(new Error('batch failed')))
            .mockImplementation((): Promise<void> => Promise.resolve());
        const harness = renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(harness.showToast).toHaveBeenCalledWith('Unable to rename account right now', 'error'));

        await user.clear(input);
        await user.type(input, 'Everyday Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(2));
        expect(harness.renameAccount).toHaveBeenLastCalledWith('acc-1', 'Everyday Checking');
        expect(harness.showToast).toHaveBeenCalledWith('Account renamed to "Everyday Checking"', 'success');
    });

    it('rejects an ordinary unchanged name without calling the service', async () => {
        const harness = renderView();
        const user = userEvent.setup();
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Checking   Account'); // unchanged after normalization
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(harness.renameAccount).not.toHaveBeenCalled();
        expect(harness.showToast).toHaveBeenCalledWith('No changes to save', 'info');
    });
});

describe('AccountDetailsView rename — keyboard handling with the real shared Modal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 600 });
    });

    it('Escape closes the rename modal when the input is focused', async () => {
        renderView();
        const user = userEvent.setup();
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.click(input); // focus the input inside modal content
        expect(screen.getByText('Rename Account')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('Tab and Shift+Tab stay inside the dialog (focus trap)', async () => {
        renderView();
        const user = userEvent.setup();
        await openRenameModal(user);

        const dialog = screen.getByRole('dialog');
        const inDialog = () => {
            const active = document.activeElement;
            return !!active && dialog.contains(active);
        };

        const input = screen.getByLabelText('Account name');
        input.focus();

        // Walk forward through several tabs; focus must never leave the dialog.
        for (let i = 0; i < 6; i++) {
            await user.keyboard('{Tab}');
            expect(inDialog()).toBe(true);
        }
        // Walk backwards through several shift-tabs; focus must never leave the dialog.
        for (let i = 0; i < 6; i++) {
            await user.keyboard('{Shift>}{Tab}{/Shift}');
            expect(inDialog()).toBe(true);
        }
    });

    it('disabled controls are excluded from focus traversal while saving', async () => {
        let resolveRename: (value: void) => void = () => {};
        const renameAccount = vi.fn<RenameFn>().mockImplementation(() => new Promise<void>((resolve) => { resolveRename = resolve; }));
        renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        // Saving state: input, Cancel and Save are disabled; only the modal's
        // Close (X) button remains focusable.
        await waitFor(() => expect(screen.getByRole('button', { name: 'Renaming...' })).toBeDisabled());
        expect(input).toBeDisabled();

        const dialog = screen.getByRole('dialog');
        const closeButton = screen.getByRole('button', { name: 'Close modal' });
        closeButton.focus();

        // Trap boundaries: Close is now both first and last focusable —
        // Tab/Shift+Tab must wrap within the dialog and never focus a disabled control.
        await user.keyboard('{Tab}');
        expect(document.activeElement).toBe(closeButton);
        await user.keyboard('{Shift>}{Tab}{/Shift}');
        expect(document.activeElement).toBe(closeButton);
        expect(dialog.contains(document.activeElement)).toBe(true);

        resolveRename();
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('Enter submits exactly once; pending protections remain intact', async () => {
        let resolveRename: (value: void) => void = () => {};
        const renameAccount = vi.fn<RenameFn>().mockImplementation(() => new Promise<void>((resolve) => { resolveRename = resolve; }));
        const harness = renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.keyboard('{Enter}');
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(1));
        expect(renameAccount).toHaveBeenCalledWith('acc-1', 'Main Checking');

        // Enter again while pending: the input is disabled, nothing submits twice.
        await user.keyboard('{Enter}');
        await user.keyboard('{Enter}');
        expect(renameAccount).toHaveBeenCalledTimes(1);

        resolveRename();
        await waitFor(() => expect(screen.queryByText('Rename Account')).not.toBeInTheDocument());
        expect(harness.showToast).toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
    });

    it('focus returns to the mounted Account options button after closing', async () => {
        renderView();
        const user = userEvent.setup();
        await openRenameModal(user);
        expect(screen.getByText('Rename Account')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByText('Rename Account')).not.toBeInTheDocument());
        // The action-sheet trigger unmounted; focus returns to a sensible mounted control.
        await waitFor(() => expect(screen.getByLabelText('Account options')).toHaveFocus());
    });
});
