// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommandPalette } from './CommandPalette';
import { AppContext } from '../../context/AnchorContext';
import { FinanceContext } from '../../context/FinanceContext';
import { TaskContext } from '../../context/TaskContext';
import type { TabView } from '../../types';

// Mock Lucide icons - use importOriginal to get all real icons
// This avoids breaking when new icons are added to the component
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return {
        ...actual,
        // Override specific icons for testing if needed
        Search: () => <span data-testid="search-icon" />,
        ArrowRight: () => <span data-testid="arrow-right" />,
    };
});

const mockNavigateTo = vi.fn();

const createMockContexts = () => {
    const app = {
        navigateTo: mockNavigateTo,
        activeTab: 'dashboard' as TabView,
        user: { uid: 'test-user' },
        loading: false,
        profile: { name: 'Test', familyMode: false, theme: 'light' },
    };

    const finance = {
        accounts: [
            { id: '1', name: 'Chase Checking', isArchived: false },
            { id: '2', name: 'Archived Account', isArchived: true }
        ],
        transactions: [],
        addAccount: vi.fn(),
        deleteAccount: vi.fn(),
        addTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
        shareAccount: vi.fn(),
        loadMoreTransactions: vi.fn(),
        restoreTransaction: vi.fn(),
        convertCurrency: vi.fn(),
    };

    const tasks = {
        tasks: [
            { id: 't1', title: 'Pay Rent', completed: false },
            { id: 't2', title: 'Done Task', completed: true }
        ],
        addTask: vi.fn(),
        toggleTask: vi.fn(),
        deleteTask: vi.fn(),
    };

    return { app, finance, tasks };
};

const renderWithContexts = (ui: React.ReactElement) => {
    const { app, finance, tasks } = createMockContexts();
    return render(
        <AppContext.Provider value={app as any}>
            <FinanceContext.Provider value={finance as any}>
                <TaskContext.Provider value={tasks as any}>
                    {ui}
                </TaskContext.Provider>
            </FinanceContext.Provider>
        </AppContext.Provider>
    );
};

describe('CommandPalette', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('is hidden by default', () => {
        renderWithContexts(<CommandPalette />);
        expect(screen.queryByPlaceholderText(/Search queries/i)).not.toBeInTheDocument();
    });

    it('opens on Cmd+K', () => {
        renderWithContexts(<CommandPalette />);

        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        expect(screen.getByPlaceholderText(/Search queries/i)).toBeInTheDocument();
        // Verify dynamic results
        expect(screen.getByText('Chase Checking')).toBeInTheDocument();
        expect(screen.queryByText('Archived Account')).not.toBeInTheDocument();
        expect(screen.getByText('Pay Rent')).toBeInTheDocument();
    });

    it('filters results by search query', async () => {
        renderWithContexts(<CommandPalette />);

        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        const input = screen.getByPlaceholderText(/Search queries/i);
        fireEvent.change(input, { target: { value: 'Rent' } });

        expect(screen.getByText('Pay Rent')).toBeInTheDocument();
        expect(screen.queryByText('Chase Checking')).not.toBeInTheDocument();
    });

    it('navigates on click and closes', async () => {
        renderWithContexts(<CommandPalette />);

        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        const navItem = screen.getByText('Go to Dashboard');
        fireEvent.click(navItem);

        expect(mockNavigateTo).toHaveBeenCalledWith('dashboard');
        await waitFor(() => {
            expect(screen.queryByPlaceholderText(/Search queries/i)).not.toBeInTheDocument();
        });
    });
});
