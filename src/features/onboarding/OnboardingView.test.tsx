// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingView } from './OnboardingView';
import { AppContext } from '../../context/AnchorContext';
import { FinanceContext } from '../../context/FinanceContext';
import { TaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { UserProfile, TabView } from '../../types';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ArrowRight: () => <span data-testid="arrow-right" />,
    Wallet: () => <span data-testid="wallet" />,
    CheckCircle2: (props: Record<string, unknown>) => <span data-testid={props['data-testid'] || 'check-circle'} />,
    Sparkles: () => <span data-testid="sparkles" />,
    Shield: () => <span data-testid="shield" />,
    Mail: () => <span data-testid="mail" />,
    Target: () => <span data-testid="target" />,
}));

vi.mock('../../components/shared', () => ({
    AnchorLogo: () => <span data-testid="anchor-logo" />
}));

const mockProfile: UserProfile = {
    name: 'Test Captain',
    familyMode: false,
    theme: 'light'
};

const createMockContexts = (financeOverrides = {}, appOverrides = {}, taskOverrides = {}, authOverrides = {}, familyOverrides = {}) => {
    const addAccount = vi.fn();
    const addTask = vi.fn();
    const updateProfile = vi.fn();

    const app = {
        navigateTo: vi.fn(),
        activeTab: 'dashboard' as TabView,
        ...appOverrides,
    };

    const finance = {
        accounts: [],
        transactions: [],
        addAccount,
        deleteAccount: vi.fn(),
        addTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
        shareAccount: vi.fn(),
        loadMoreTransactions: vi.fn(),
        restoreTransaction: vi.fn(),
        convertCurrency: vi.fn(),
        loadingFinance: false,
        ...financeOverrides,
    };

    const tasks = {
        tasks: [],
        addTask,
        toggleTask: vi.fn(),
        deleteTask: vi.fn(),
        ...taskOverrides,
    };

    const auth = {
        user: { uid: 'test-uid', emailVerified: false } as any,
        profile: mockProfile,
        loading: false,
        profileLoaded: true,
        updateProfile,
        signIn: vi.fn(),
        signUp: vi.fn(),
        verifyMfa: vi.fn(),
        generateMfaSecret: vi.fn(),
        enrollMfa: vi.fn(),
        unenrollMfa: vi.fn(),
        logout: vi.fn(),
        sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
        sendPasswordReset: vi.fn(),
        reauthenticate: vi.fn(),
        accountNotifications: [],
        ...authOverrides,
    };

    const family = {
        spouseId: null,
        sendInvite: vi.fn(),
        acceptInvite: vi.fn(),
        ...familyOverrides,
    };

    const notifications = {
        showToast: vi.fn(),
        confirm: vi.fn().mockResolvedValue(true),
    };

    return { app, finance, tasks, auth, family, notifications, addAccount, addTask, updateProfile };
};

const renderWithContexts = (mockOverrides?: ReturnType<typeof createMockContexts>) => {
    const mocks = mockOverrides || createMockContexts();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return {
        ...render(
            <QueryClientProvider client={queryClient}>
                <AuthContext.Provider value={mocks.auth as any}>

                    <AppContext.Provider value={mocks.app as any}>
                        <FinanceContext.Provider value={mocks.finance as any}>
                            <TaskContext.Provider value={mocks.tasks as any}>
                                <NotificationContext.Provider value={mocks.notifications as any}>
                                    <OnboardingView />
                                </NotificationContext.Provider>
                            </TaskContext.Provider>
                        </FinanceContext.Provider>
                    </AppContext.Provider>

                </AuthContext.Provider>
            </QueryClientProvider>
        ),
        mocks,
    };
};

describe('OnboardingView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders Step 1 (Welcome) initially', () => {
        renderWithContexts();

        expect(screen.getByText('Welcome to Anchor OS.')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Captain')).toBeInTheDocument();
        expect(screen.getByText("Let's Begin")).toBeInTheDocument();
        expect(screen.getByTestId('onboarding-illustration')).toBeInTheDocument();
    });

    it('resumes at the persisted step instead of restarting at step 1 (UX-OB-06)', () => {
        const authOverrides: Record<string, unknown> = {
            profile: {
                ...mockProfile,
                onboardingProgress: {
                    gettingStartedStep: 3,
                    securityStepSeen: false,
                    beyondBasicsComplete: false,
                    completedItems: [],
                },
            },
        };
        renderWithContexts(createMockContexts({}, {}, {}, authOverrides));

        // Step 3 is the goal step — a reload must not send the user back to step 1.
        expect(screen.getByText('Set a Goal')).toBeInTheDocument();
        expect(screen.queryByText('Welcome to Anchor OS.')).not.toBeInTheDocument();
    });

    it('transitions to Step 2 (Account) on click', async () => {
        const { mocks } = renderWithContexts();

        fireEvent.click(screen.getByText("Let's Begin"));

        await waitFor(() => {
            expect(mocks.updateProfile).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test Captain', onboardingComplete: false }));
        });
        await waitFor(() => screen.getByText('Add Primary Account'));
        expect(screen.getByText('Add Primary Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Chase Checking')).toBeInTheDocument();
    });

    it('calls addAccount and moves to Step 3', async () => {
        const { mocks } = renderWithContexts();

        // Go to Step 2
        fireEvent.click(screen.getByText("Let's Begin"));
        await waitFor(() => screen.getByText('Add Primary Account'));

        // Fill Account Form
        fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'My Bank' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '5000' } });

        // Submit
        const continueBtn = screen.getByText('Continue');
        fireEvent.click(continueBtn);

        await waitFor(() => {
            expect(mocks.addAccount).toHaveBeenCalledWith(expect.objectContaining({
                name: 'My Bank',
                balanceCents: 500000,
                currency: 'USD', // Default
            }));
        });

        // Should now be on Step 3 (Goal)
        await waitFor(() => screen.getByText('Set a Goal'), { timeout: 2000 });
        expect(screen.getByText('Set a Goal')).toBeInTheDocument();
    });

    it('calls addTask and advances to Step 5 (Security)', async () => {
        const { mocks } = renderWithContexts();

        // Step 1 -> 2
        fireEvent.click(screen.getByText("Let's Begin"));
        await waitFor(() => screen.getByText('Add Primary Account'));
        // Step 2 -> 3 (Goal)
        fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'Bank' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
        fireEvent.click(screen.getByText('Continue'));

        await waitFor(() => screen.getByText('Set a Goal'));
        // Step 3 -> 4 (Habit) via Skip
        fireEvent.click(screen.getByText('Skip for now'));

        await waitFor(() => screen.getByText('One Small Habit'));

        // Fill Task
        fireEvent.change(screen.getByPlaceholderText(/e.g. Drink water/i), { target: { value: 'Run 1 mile' } });

        // Submit — now advances to Security step instead of finishing
        fireEvent.click(screen.getByText('Finish Setup'));

        await waitFor(() => {
            expect(mocks.addTask).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Run 1 mile',
                type: 'daily'
            }));
        });

        // Should now be on Step 5
        await waitFor(() => screen.getByText('Secure Your Account'));
        expect(screen.getByText('Secure Your Account')).toBeInTheDocument();
    });

    // ========================================
    // NEW TESTS: Issue 5.1 - Skip Option
    // ========================================
    describe('Skip Functionality', () => {
        it('offers finish-later (not a step skip) on Step 1', () => {
            renderWithContexts();
            expect(screen.getByText('Finish later')).toBeInTheDocument();
            expect(screen.queryByText(/skip/i)).not.toBeInTheDocument();
        });

        it('shows skip link on Step 2', async () => {
            renderWithContexts();
            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));
            expect(screen.getByText(/skip/i)).toBeInTheDocument();
        });

        it('"Finish later" on step 1 exits setup and records progress (UX-OB-09)', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText('Finish later'));

            await waitFor(() => {
                expect(mocks.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
                    onboardingComplete: true,
                    onboardingProgress: expect.objectContaining({ beyondBasicsComplete: false }),
                }));
            });
        });

        it('skipping a later step advances instead of ending setup (UX-OB-09)', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            fireEvent.click(screen.getByText(/skip/i));

            await waitFor(() => screen.getByText('Set a Goal'));
            expect(screen.getByText('Set a Goal')).toBeInTheDocument();
            expect(mocks.updateProfile).not.toHaveBeenCalledWith(
                expect.objectContaining({ onboardingComplete: true }),
            );
        });
    });

    // ========================================
    // NEW TESTS: Progress Indicator
    // ========================================
    describe('Progress Indicator', () => {
        it('shows Step 1 of 5 on first step', () => {
            renderWithContexts();
            expect(screen.getByText(/step 1 of 5/i)).toBeInTheDocument();
        });

        it('shows Step 2 of 5 on account step', async () => {
            renderWithContexts();
            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));
            expect(screen.getByText(/step 2 of 5/i)).toBeInTheDocument();
        });

        it('shows Step 3 of 5 on goal step', async () => {
            renderWithContexts();

            // Go to step 2
            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // Fill and submit to go to step 3 (Goal)
            fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'Bank' } });
            fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
            fireEvent.click(screen.getByText('Continue'));

            await waitFor(() => screen.getByText('Set a Goal'));
            expect(screen.getByText(/step 3 of 5/i)).toBeInTheDocument();
        });
    });

    // ========================================
    // NEW TESTS: Account Type Selection
    // ========================================
    describe('Account Type Selection', () => {
        it('shows account type selector on Step 2', async () => {
            renderWithContexts();
            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // Should have account type options
            expect(screen.getByText('Checking')).toBeInTheDocument();
            expect(screen.getByText('Savings')).toBeInTheDocument();
        });

        it('passes selected account type to addAccount', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // Fill form
            fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'My Savings' } });
            fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });

            // Select Savings type
            fireEvent.click(screen.getByText('Savings'));

            // Submit
            fireEvent.click(screen.getByText('Continue'));

            await waitFor(() => {
                expect(mocks.addAccount).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'savings',
                }));
            });
        });
    });

    // ========================================
    // UX-OB-03: no pre-filled junk data
    // ========================================
    describe('UX-OB-03: nothing is created unless the user chooses it', () => {
        it('starts the account name and balance empty (suggestions are placeholders)', async () => {
            renderWithContexts();

            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // The previous defect: these inputs were pre-filled with 'Main Checking'.
            // (`.value` is checked directly because jest-dom reports `null` for an
            // empty `input[type=number]`.)
            expect((screen.getByPlaceholderText('e.g. Chase Checking') as HTMLInputElement).value).toBe('');
            expect((screen.getByPlaceholderText('0.00') as HTMLInputElement).value).toBe('');
        });

        it('does not manufacture an account from default text when the name is never chosen', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // Tapping straight through must not create anything.
            fireEvent.click(screen.getByText('Continue'));

            expect(mocks.addAccount).not.toHaveBeenCalled();
        });

        it('starts the habit title empty and refuses to create an unnamed commitment', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));

            fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'Bank' } });
            fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
            fireEvent.click(screen.getByText('Continue'));
            await waitFor(() => screen.getByText('Set a Goal'));

            fireEvent.click(screen.getByText(/skip for now/i));
            await waitFor(() => screen.getByText('One Small Habit'));

            // The previous defect: pre-filled with 'Read for 15 mins'.
            expect(screen.getByPlaceholderText('e.g. Drink water, Read pages, Exercise')).toHaveValue('');

            fireEvent.click(screen.getByText('Finish Setup'));

            expect(mocks.addTask).not.toHaveBeenCalled();
        });

        it('still accepts a suggestion chip as a deliberate choice', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText("Let's Begin"));
            await waitFor(() => screen.getByText('Add Primary Account'));
            fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'Bank' } });
            fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
            fireEvent.click(screen.getByText('Continue'));
            await waitFor(() => screen.getByText('Set a Goal'));
            fireEvent.click(screen.getByText(/skip for now/i));
            await waitFor(() => screen.getByText('One Small Habit'));

            fireEvent.click(screen.getByText('Drink 2L Water'));
            fireEvent.click(screen.getByText('Finish Setup'));

            await waitFor(() => {
                expect(mocks.addTask).toHaveBeenCalledWith(expect.objectContaining({
                    title: 'Drink 2L Water',
                }));
            });
        });
    });

    /**
     * UX-OB-02: every step persists through one contract — attempt the write,
     * advance only on success, and on failure say what happened and stay put.
     * Two steps previously had no error handling at all.
     */
    describe('UX-OB-02 — one persistence contract with recovery', () => {
        it('stays on step 1 and says so when the profile write fails', async () => {
            const mocks = createMockContexts();
            mocks.updateProfile.mockRejectedValueOnce(new Error('offline'));
            renderWithContexts(mocks);

            fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Ada' } });
            fireEvent.click(screen.getByText(/Let's Begin/i));

            await waitFor(() => {
                expect(mocks.notifications.showToast).toHaveBeenCalledWith(
                    expect.stringMatching(/Couldn't save your name/i),
                    'error',
                );
            });
            // Still on step 1: the account step never appeared.
            expect(screen.queryByText(/Skip for now/)).not.toBeInTheDocument();
        });

        it('keeps the user on the account step and reports the failure', async () => {
            const mocks = createMockContexts();
            mocks.addAccount.mockRejectedValueOnce(new Error('denied'));
            renderWithContexts(mocks);

            fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Ada' } });
            fireEvent.click(screen.getByText(/Let's Begin/i));
            await waitFor(() => expect(screen.getByText('Skip for now')).toBeInTheDocument());

            fireEvent.change(screen.getByPlaceholderText(/e\.g\. Chase Checking/i), { target: { value: 'Checking' } });
            fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
            fireEvent.click(screen.getByRole('button', { name: /^continue$/i }));

            await waitFor(() => {
                expect(mocks.notifications.showToast).toHaveBeenCalledWith(
                    expect.stringMatching(/Couldn't save your account/i),
                    'error',
                );
            });
            // The form is still there, so pressing the same button again is enough.
            expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument();
        });

        it('does not leave onboarding when the final write fails', async () => {
            const mocks = createMockContexts();
            // Step 1's write succeeds; the security step's write fails.
            mocks.updateProfile.mockResolvedValueOnce(undefined).mockRejectedValue(new Error('offline'));
            renderWithContexts(mocks);

            fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Ada' } });
            fireEvent.click(screen.getByText(/Let's Begin/i));

            // Skip through steps 2, 3 and 4 (skips advance without a write).
            for (let i = 0; i < 3; i += 1) {
                await waitFor(() => expect(screen.getByText('Skip for now')).toBeInTheDocument());
                fireEvent.click(screen.getByText('Skip for now'));
            }

            await waitFor(() => expect(screen.getByRole('button', { name: /continue to anchor os/i })).toBeInTheDocument());
            fireEvent.click(screen.getByRole('button', { name: /continue to anchor os/i }));

            await waitFor(() => {
                expect(mocks.notifications.showToast).toHaveBeenCalledWith(
                    expect.stringMatching(/Couldn't save your security choices/i),
                    'error',
                );
            });
            // The final control is still there, so the user can simply try again.
            expect(screen.getByRole('button', { name: /continue to anchor os/i })).toBeInTheDocument();
        });
    });
});
