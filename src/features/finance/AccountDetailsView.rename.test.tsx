// @ts-nocheck

/**
 * AccountDetailsView rename regression tests (Issue #142 follow-up).
 *
 * These tests deliberately use the REAL shared Modal (no vi.mock) so keyboard
 * handling (Escape, Tab focus trap, disabled exclusion, focus restore) is
 * exercised against the same component the app renders. The partial-failure
 * sequence is injected deterministically: the account prop is updated while the
 * rename promise is pending (simulating the accounts onSnapshot listener
 * delivering the account-document batch) and the operation then rejects
 * (simulating a later transaction-batch failure).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountDetailsView } from './AccountDetailsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContext } from '../../context/AnchorContext';
import { FinanceContext } from '../../context/FinanceContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import type { AnchorAccount, AnchorTransaction, UserProfile } from '../../types';

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

interface Harness {
    renameAccount: ReturnType<typeof vi.fn>;
    showToast: ReturnType<typeof vi.fn>;
    rerenderWith: (account: AnchorAccount) => void;
}

const renderView = (account: AnchorAccount = mockAccount, overrides: { renameAccount?: ReturnType<typeof vi.fn> } = {}): Harness => {
    const renameAccount = overrides.renameAccount ?? vi.fn().mockResolvedValue(undefined);
    const showToast = vi.fn();
    const finance = {
        transactions: mockTransactions,
        accounts: [account],
        addAccount: vi.fn(),
        deleteAccount: vi.fn(),
        addTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
        updateAccountPersonalization: vi.fn(),
        renameAccount,
        shareAccount: vi.fn(),
        currentMonth: new Date(),
        nextMonth: vi.fn(),
        prevMonth: vi.fn(),
        jumpToMonth: vi.fn(),
        loadingFinance: false,
    };
    const app = { navigateTo: vi.fn(), activeTab: 'finance' };
    const auth = { user: { uid: 'test-user' }, profile: mockProfile };
    const notifications = { showToast, confirm: vi.fn().mockResolvedValue(true) };

    const wrap = (acc: AnchorAccount) => (
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <AuthContext.Provider value={auth}>
                <AppContext.Provider value={app}>
                    <FinanceContext.Provider value={finance}>
                        <NotificationContext.Provider value={notifications}>
                            <AccountDetailsView account={acc} onBack={vi.fn()} />
                        </NotificationContext.Provider>
                    </FinanceContext.Provider>
                </AppContext.Provider>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    const view = render(wrap(account));
    return {
        renameAccount,
        showToast,
        rerenderWith: (acc: AnchorAccount) => view.rerender(wrap(acc)),
    };
};

const openRenameModal = async (user) => {
    await user.click(screen.getByLabelText('Account options'));
    await user.click(screen.getByText('Edit Account'));
    return screen.getByRole('dialog');
};

describe('AccountDetailsView rename — partial failure recovery', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 600 });
    });

    it('partial snapshot success + later batch failure does not block retry', async () => {
        let rejectFirst: (reason?: unknown) => void = () => {};
        const renameAccount = vi.fn()
            .mockImplementationOnce(() => new Promise<void>((_, reject) => { rejectFirst = reject; }))
            .mockResolvedValueOnce(undefined);
        const harness = renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        // While pending, the accounts onSnapshot listener delivers the applied
        // account-document batch (AccountService commits the name before the
        // transaction batches).
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(1));
        harness.rerenderWith({ ...mockAccount, name: 'Main Checking' });

        // A later transaction batch fails.
        rejectFirst(new Error('batch failed'));

        await waitFor(() => expect(harness.showToast).toHaveBeenCalledWith('Unable to rename account right now', 'error'));
        // No success is claimed while transaction updates remain incomplete.
        expect(harness.showToast).not.toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
        // Modal stays open with the entered text preserved.
        expect(screen.getByText('Rename Account')).toBeInTheDocument();
        expect(screen.getByLabelText('Account name')).toHaveValue('Main Checking');

        // Retry the same entered name: must NOT be rejected as unchanged even though
        // the account snapshot already shows the submitted name.
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(2));
        // The retry reuses the existing service path with the account id and the same
        // (trimmed) name so the remaining transaction batches are completed.
        expect(renameAccount).toHaveBeenLastCalledWith('acc-1', 'Main Checking');
        await waitFor(() => expect(screen.queryByText('Rename Account')).not.toBeInTheDocument());
        expect(harness.showToast).toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
    });

    it('still rejects an ordinary unchanged name while the snapshot has not changed', async () => {
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
        const renameAccount = vi.fn().mockImplementation(() => new Promise<void>((resolve) => { resolveRename = resolve; }));
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
        const renameAccount = vi.fn().mockImplementation(() => new Promise<void>((resolve) => { resolveRename = resolve; }));
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
