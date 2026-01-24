
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
    CheckCircle2: () => <span data-testid="check-circle" />,
    Sparkles: () => <span data-testid="sparkles" />,
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
        user: { uid: 'test-uid' } as any,
        profile: mockProfile,
        loading: false,
        updateProfile,
        signIn: vi.fn(),
        signUp: vi.fn(),
        verifyMfa: vi.fn(),
        generateMfaSecret: vi.fn(),
        enrollMfa: vi.fn(),
        unenrollMfa: vi.fn(),
        logout: vi.fn(),
        sendVerificationEmail: vi.fn(),
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

        expect(screen.getByText(/Welcome aboard/i)).toBeInTheDocument();
        expect(screen.getByText('Test Captain')).toBeInTheDocument();
        expect(screen.getByText('Start Setup')).toBeInTheDocument();
    });

    it('transitions to Step 2 (Account) on click', async () => {
        const { mocks } = renderWithContexts();

        fireEvent.click(screen.getByText('Start Setup'));

        await waitFor(() => {
            expect(mocks.updateProfile).toHaveBeenCalledWith({ onboardingComplete: false });
        });
        expect(screen.getByText('Add Primary Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Chase Checking')).toBeInTheDocument();
    });

    it('calls addAccount and moves to Step 3', async () => {
        const { mocks } = renderWithContexts();

        // Go to Step 2
        fireEvent.click(screen.getByText('Start Setup'));
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

        // Should now be on Step 3
        expect(screen.getByText('One Small Habit')).toBeInTheDocument();
    });

    it('calls addTask calls on final step', async () => {
        const { mocks } = renderWithContexts();

        // Step 1 -> 2
        fireEvent.click(screen.getByText('Start Setup'));
        await waitFor(() => screen.getByText('Add Primary Account'));
        // Step 2 -> 3
        fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'Bank' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
        fireEvent.click(screen.getByText('Continue'));

        await waitFor(() => screen.getByText('One Small Habit'));

        // Fill Task
        fireEvent.change(screen.getByPlaceholderText(/e.g. Drink water/i), { target: { value: 'Run 1 mile' } });

        // Submit
        fireEvent.click(screen.getByText('Finish Setup'));

        await waitFor(() => {
            expect(mocks.addTask).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Run 1 mile',
                type: 'daily'
            }));
        });
    });

    // ========================================
    // NEW TESTS: Issue 5.1 - Skip Option
    // ========================================
    describe('Skip Functionality', () => {
        it('shows skip link on Step 1', () => {
            renderWithContexts();
            expect(screen.getByText(/skip/i)).toBeInTheDocument();
        });

        it('shows skip link on Step 2', async () => {
            renderWithContexts();
            fireEvent.click(screen.getByText('Start Setup'));
            await waitFor(() => screen.getByText('Add Primary Account'));
            expect(screen.getByText(/skip/i)).toBeInTheDocument();
        });

        it('clicking skip sets onboardingComplete to true', async () => {
            const { mocks } = renderWithContexts();

            const skipLink = screen.getByText(/skip/i);
            fireEvent.click(skipLink);

            await waitFor(() => {
                expect(mocks.updateProfile).toHaveBeenCalledWith({ onboardingComplete: true });
            });
        });
    });

    // ========================================
    // NEW TESTS: Progress Indicator
    // ========================================
    describe('Progress Indicator', () => {
        it('shows Step 1 of 3 on first step', () => {
            renderWithContexts();
            expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
        });

        it('shows Step 2 of 3 on account step', async () => {
            renderWithContexts();
            fireEvent.click(screen.getByText('Start Setup'));
            await waitFor(() => screen.getByText('Add Primary Account'));
            expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
        });

        it('shows Step 3 of 3 on habit step', async () => {
            const { mocks } = renderWithContexts();

            // Go to step 2
            fireEvent.click(screen.getByText('Start Setup'));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // Fill and submit to go to step 3
            fireEvent.change(screen.getByPlaceholderText('e.g. Chase Checking'), { target: { value: 'Bank' } });
            fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
            fireEvent.click(screen.getByText('Continue'));

            await waitFor(() => screen.getByText('One Small Habit'));
            expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
        });
    });

    // ========================================
    // NEW TESTS: Account Type Selection
    // ========================================
    describe('Account Type Selection', () => {
        it('shows account type selector on Step 2', async () => {
            renderWithContexts();
            fireEvent.click(screen.getByText('Start Setup'));
            await waitFor(() => screen.getByText('Add Primary Account'));

            // Should have account type options
            expect(screen.getByText('Checking')).toBeInTheDocument();
            expect(screen.getByText('Savings')).toBeInTheDocument();
        });

        it('passes selected account type to addAccount', async () => {
            const { mocks } = renderWithContexts();

            fireEvent.click(screen.getByText('Start Setup'));
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
});
