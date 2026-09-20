/**
 * AccountDetailsView rename regression tests (Issue #142 follow-up).
 *
 * These tests deliberately use the REAL shared Modal (no vi.mock) so keyboard
 * handling (Escape, Tab focus trap, disabled exclusion, focus restore) is
 * exercised against the same component the app renders.
 *
 * Recovery semantics are guaranteed by AccountService.renameAccount, which
 * commits the account document LAST, after every transaction-update batch.
 * A partial failure leaves the account name unchanged, but transaction
 * accountName labels may already have moved to the new name — durable partial
 * state. Retrying the submitted name finishes the rename; re-submitting the
 * current account name runs the service's label-repair path (no history
 * entry), which the UI offers when it detects stale labels from live data.
 * The UI tests here assert the contract: failure keeps the modal open with
 * the entered text and never reports success; retry reuses the same service
 * call; an unchanged name with no stale labels still short-circuits.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import * as firestore from 'firebase/firestore';
import { AccountDetailsView } from './AccountDetailsView';
import { AccountService } from '../../services/AccountService';
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
    unmount: () => void;
}

const renderView = (
    account: AnchorAccount = mockAccount,
    overrides: { renameAccount?: RenameFn; transactions?: AnchorTransaction[]; userId?: string } = {},
): Harness => {
    const renameAccount = vi.fn<RenameFn>(
        overrides.renameAccount ?? ((): Promise<{ labelsRepaired: boolean }> => Promise.resolve({ labelsRepaired: false })),
    );
    const showToast = vi.fn<NotificationValue['showToast']>();
    const finance: FinanceValue = {
        transactions: overrides.transactions ?? mockTransactions,
        accounts: [account],
        loadingFinance: false,
        // UX-FN-03: addAccount now returns the created account id.
        addAccount: () => Promise.resolve(undefined),
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
        user: overrides.userId ? ({ uid: overrides.userId } as unknown as AuthValue['user']) : null,
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

    const rendered = render(
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
    return { renameAccount, showToast, unmount: rendered.unmount };
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
            .mockImplementation((): Promise<{ labelsRepaired: boolean }> => Promise.resolve({ labelsRepaired: false }));
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
            .mockImplementation((): Promise<{ labelsRepaired: boolean }> => Promise.resolve({ labelsRepaired: false }));
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

    it('an ordinary unchanged name delegates to the service and reports no changes when nothing diverged', async () => {
        const harness = renderView();
        const user = userEvent.setup();
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Checking   Account'); // unchanged after normalization
        await user.click(screen.getByRole('button', { name: 'Save' }));
        // The authoritative "is anything divergent?" check lives in the service.
        await waitFor(() => expect(harness.renameAccount).toHaveBeenCalledWith('acc-1', 'Checking   Account'));
        expect(harness.showToast).toHaveBeenCalledWith('No changes to save', 'info');
        expect(harness.showToast).not.toHaveBeenCalledWith(expect.stringContaining('Transaction labels restored'), 'success');
    });

    // A partial rename failure leaves transaction accountName labels ahead of the
    // persisted account name. The UI delegates the unchanged name to
    // AccountService, which detects divergence in Firestore and reports whether
    // it repaired anything — so recovery works on a freshly mounted view
    // (close/reopen and full reload), independent of which transactions the
    // date-filtered context happens to hold.
    it('submitting the current name repairs stale labels through the service', async () => {
        const renameAccount = vi.fn<RenameFn>().mockResolvedValue({ labelsRepaired: true });
        const harness = renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        // Input is prefilled with the current account name — submit as-is.
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(harness.renameAccount).toHaveBeenCalledTimes(1));
        expect(harness.renameAccount).toHaveBeenCalledWith('acc-1', 'Checking Account');
        await waitFor(() => expect(screen.queryByText('Rename Account')).not.toBeInTheDocument());
        expect(harness.showToast).toHaveBeenCalledWith('Transaction labels restored to "Checking Account"', 'success');
        expect(harness.showToast).not.toHaveBeenCalledWith('No changes to save', 'info');
    });

    it('repair is offered after a remount (no reliance on component memory)', async () => {
        const first = renderView(mockAccount, {
            renameAccount: vi.fn<RenameFn>().mockResolvedValue({ labelsRepaired: true }),
        });
        expect(first.renameAccount).not.toHaveBeenCalled();
        // Unmount the whole tree and mount a completely fresh one, as after a reload.
        first.unmount();
        const second = renderView(mockAccount, {
            renameAccount: vi.fn<RenameFn>().mockResolvedValue({ labelsRepaired: true }),
        });
        const user = userEvent.setup();
        await openRenameModal(user);
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(second.renameAccount).toHaveBeenCalledWith('acc-1', 'Checking Account'));
        expect(second.showToast).toHaveBeenCalledWith('Transaction labels restored to "Checking Account"', 'success');
    });

    it('a failed repair never reports success and can be retried', async () => {
        const renameAccount = vi.fn<RenameFn>()
            .mockImplementationOnce(() => Promise.reject(new Error('batch failed')))
            .mockImplementation((): Promise<{ labelsRepaired: boolean }> => Promise.resolve({ labelsRepaired: true }));
        const harness = renderView(mockAccount, { renameAccount });
        const user = userEvent.setup();
        await openRenameModal(user);

        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(harness.showToast).toHaveBeenCalledWith('Unable to restore transaction labels right now', 'error'));
        expect(harness.showToast).not.toHaveBeenCalledWith('Transaction labels restored to "Checking Account"', 'success');
        expect(screen.getByText('Rename Account')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(harness.showToast).toHaveBeenCalledWith('Transaction labels restored to "Checking Account"', 'success'));
        expect(renameAccount).toHaveBeenCalledTimes(2);
    });

    it('the intended rename can still finish after labels diverged', async () => {
        const harness = renderView(mockAccount);
        const user = userEvent.setup();
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(harness.renameAccount).toHaveBeenCalledWith('acc-1', 'Main Checking'));
        expect(harness.showToast).toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
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
        let resolveRename: (value: { labelsRepaired: boolean }) => void = () => {};
        const renameAccount = vi.fn<RenameFn>().mockImplementation(
            () => new Promise<{ labelsRepaired: boolean }>((resolve) => { resolveRename = resolve; }),
        );
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

        resolveRename({ labelsRepaired: false });
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('Enter submits exactly once; pending protections remain intact', async () => {
        let resolveRename: (value: { labelsRepaired: boolean }) => void = () => {};
        const renameAccount = vi.fn<RenameFn>().mockImplementation(
            () => new Promise<{ labelsRepaired: boolean }>((resolve) => { resolveRename = resolve; }),
        );
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

        resolveRename({ labelsRepaired: false });
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

/**
 * UI-to-service recovery, end to end through the real AccountService and a
 * deterministic in-memory Firestore double.
 *
 * Regression for the demonstrated defect: a rename that failed after at least
 * one transaction batch committed leaves the account name unchanged
 * ("Checking") while some transaction labels already say the new name
 * ("Household"). The visible (current-month) transaction list here is EMPTY, so
 * the fix cannot rely on client-side detection — AccountService must detect the
 * divergence in Firestore and the UI must delegate the unchanged name to it.
 */
describe('AccountDetailsView rename — UI-to-service recovery (persisted state)', () => {
    const OWNER = 'owner-1';
    const ACC = 'acc-1';
    const APP = 'anchor-os';
    const ACC_PATH = `artifacts/${APP}/users/${OWNER}/accounts/${ACC}`;
    const txPath = (index: number) => `artifacts/${APP}/users/${OWNER}/finance/tx-${index}`;

    type StoredDoc = Record<string, unknown>;
    interface FakeDoc { ref: { path: string }; data: () => StoredDoc }

    const installStore = () => {
        const docs = new Map<string, StoredDoc>();
        docs.set(ACC_PATH, { name: 'Checking', nameHistory: [] });
        // Durable partial state: labels moved to "Household", account did not.
        docs.set(txPath(0), { accountId: ACC, accountName: 'Household', amountCents: 1234 });
        docs.set(txPath(1), { accountId: ACC, accountName: 'Household', amountCents: 5678 });

        vi.mocked(firestore.doc).mockImplementation((_db, ...segments: string[]) =>
            ({ path: segments.join('/') }) as unknown as ReturnType<typeof firestore.doc>);
        vi.mocked(firestore.collection).mockImplementation((_db, ...segments: string[]) =>
            ({ path: segments.join('/') }) as unknown as ReturnType<typeof firestore.collection>);
        vi.mocked(firestore.query).mockImplementation((ref, ...constraints) =>
            ({ ...(ref as object), constraints }) as unknown as ReturnType<typeof firestore.query>);
        vi.mocked(firestore.where).mockImplementation((field, _op, value) =>
            ({ field, value }) as unknown as ReturnType<typeof firestore.where>);
        vi.mocked(firestore.getDocs).mockImplementation(async (rawQuery) => {
            const { path: prefix, constraints = [] } = rawQuery as unknown as {
                path: string;
                constraints: { field: string; value: unknown }[];
            };
            const matches: FakeDoc[] = [];
            for (const [path, data] of docs) {
                if (!path.startsWith(prefix + '/')) continue;
                if (!constraints.every(c => data[c.field] === c.value)) continue;
                matches.push({ ref: { path }, data: () => data });
            }
            return { docs: matches, empty: matches.length === 0 } as unknown as Awaited<ReturnType<typeof firestore.getDocs>>;
        });
        vi.mocked(firestore.writeBatch).mockImplementation(() => {
            const staged: { path: string; data: StoredDoc }[] = [];
            return {
                update: (ref: { path: string }, data: StoredDoc) => { staged.push({ path: ref.path, data }); },
                set: () => {},
                delete: () => {},
                commit: async () => {
                    for (const stagedUpdate of staged) {
                        docs.set(stagedUpdate.path, { ...docs.get(stagedUpdate.path), ...stagedUpdate.data });
                    }
                },
            } as unknown as ReturnType<typeof firestore.writeBatch>;
        });
        return docs;
    };

    const ownerAccount: AnchorAccount = {
        id: ACC,
        name: 'Checking',
        type: 'checking',
        currency: 'USD',
        balanceCents: 500000,
        color: 'bg-blue-500',
        scope: 'personal',
        ownerId: OWNER,
    };

    const wire = () => {
        const service = new AccountService();
        return renderView(ownerAccount, {
            userId: OWNER,
            transactions: [], // divergence is NOT visible in the date-filtered context
            renameAccount: (id: string, newName: string) => service.renameAccount(OWNER, 'Test User', ownerAccount, newName),
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 600 });
    });

    it('repairs divergent labels through the real service even when none are in the loaded view', async () => {
        const docs = installStore();
        const harness = wire();

        const user = userEvent.setup();
        await openRenameModal(user);
        await user.click(screen.getByRole('button', { name: 'Save' })); // submit the unchanged name

        await waitFor(() => expect(docs.get(txPath(0))?.accountName).toBe('Checking'));
        expect(docs.get(txPath(1))?.accountName).toBe('Checking');
        // Account name unchanged, and NO self-referential "Checking -> Checking" history.
        expect(docs.get(ACC_PATH)?.name).toBe('Checking');
        expect(docs.get(ACC_PATH)?.nameHistory).toEqual([]);
        // Amounts (and permissions) untouched by a label repair.
        expect(docs.get(txPath(0))?.amountCents).toBe(1234);
        expect(docs.get(txPath(1))?.amountCents).toBe(5678);
        await waitFor(() =>
            expect(harness.showToast).toHaveBeenCalledWith('Transaction labels restored to "Checking"', 'success'));
    });

    it('recovery survives a full remount (reload) with the same persisted state', async () => {
        const docs = installStore();

        const first = wire();
        first.unmount();
        const second = wire();

        const user = userEvent.setup();
        await openRenameModal(user);
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(docs.get(txPath(0))?.accountName).toBe('Checking'));
        expect(docs.get(ACC_PATH)?.name).toBe('Checking');
        expect(docs.get(ACC_PATH)?.nameHistory).toEqual([]);
        await waitFor(() =>
            expect(second.showToast).toHaveBeenCalledWith('Transaction labels restored to "Checking"', 'success'));
    });




    it('a non-owner cannot reach the repair path (permissions preserved)', async () => {
        const docs = installStore();
        const service = new AccountService();
        await expect(
            service.renameAccount('intruder', 'Intruder', ownerAccount, 'Checking')
        ).rejects.toThrow('Permission denied');
        expect(docs.get(txPath(0))?.accountName).toBe('Household');
        expect(docs.get(ACC_PATH)?.name).toBe('Checking');
    });
});
