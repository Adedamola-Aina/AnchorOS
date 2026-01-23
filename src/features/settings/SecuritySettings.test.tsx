import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsView from './SettingsView';
import { AppContext } from '../../context/AnchorContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { FinanceContext } from '../../context/FinanceContext';
import { TaskContext } from '../../context/TaskContext';
import type { UserProfile, TabView } from '../../types';

// Mock lucide-react icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return {
        ...actual,
        User: () => <div data-testid="user-icon">User</div>,
        Moon: () => <div data-testid="moon-icon">Moon</div>,
        Sun: () => <div data-testid="sun-icon">Sun</div>,
        Users: () => <div data-testid="users-icon">Users</div>,
        Mail: () => <div data-testid="mail-icon">Mail</div>,
        Check: () => <div data-testid="check-icon">Check</div>,
        Database: () => <div data-testid="database-icon">Database</div>,
        Shield: () => <div data-testid="shield-icon">Shield</div>,
        AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
        Trash2: () => <div data-testid="trash-icon">Trash</div>,
    };
});

// Mock FamilyService
vi.mock('./FamilyService', () => ({
    checkOutgoingInvite: vi.fn(),
    finalizeFamilyConnection: vi.fn(),
}));

const mockProfile: UserProfile = {
    name: 'Test User',
    familyMode: false,
    theme: 'light',
    mfaEnabled: false,
};

const createMockContexts = (appOverrides = {}, authOverrides = {}) => {
    const app = {

        user: { uid: 'test-user', email: 'test@example.com' } as any,
        loading: false,
        profile: mockProfile,
        updateProfile: vi.fn(),
        signIn: vi.fn(),
        signUp: vi.fn(),
        logout: vi.fn(),
        spouseId: null,
        sendInvite: vi.fn(),
        acceptInvite: vi.fn(),
        verifyMfa: vi.fn(),
        sendVerificationEmail: vi.fn(),
        generateMfaSecret: vi.fn().mockResolvedValue({ qrCodeUrl: 'mock-url', manualKey: 'KVKF-KR3V-NM' }),
        enrollMfa: vi.fn(),
        unenrollMfa: vi.fn(),
        navigateTo: vi.fn(),
        activeTab: 'settings' as TabView,
        ...appOverrides,
    };

    const auth = {
        user: { uid: 'test-user', email: 'test@example.com' } as any,
        profile: mockProfile,
        loading: false,
        updateProfile: vi.fn(),
        signIn: vi.fn(),
        signUp: vi.fn(),
        verifyMfa: vi.fn(),
        generateMfaSecret: vi.fn().mockResolvedValue({ qrCodeUrl: 'mock-url', manualKey: 'KVKF-KR3V-NM' }),
        enrollMfa: vi.fn(),
        unenrollMfa: vi.fn(),
        logout: vi.fn(),
        sendVerificationEmail: vi.fn(),
        accountNotifications: [],
        ...authOverrides,
    };


    const notifications = {
        showToast: vi.fn(),
        confirm: vi.fn().mockResolvedValue(true),
    };

    const finance = { accounts: [], transactions: [] };
    const tasks = { tasks: [] };

    return { app, auth, notifications, finance, tasks };
};

const renderWithContext = (ui: React.ReactElement, { app = {}, auth = {} } = {}) => {
    const mocks = createMockContexts(app, auth);
    return render(
        <AuthContext.Provider value={mocks.auth as any}>
            <AppContext.Provider value={mocks.app as any}>
                <FinanceContext.Provider value={mocks.finance as any}>
                    <TaskContext.Provider value={mocks.tasks as any}>
                        <NotificationContext.Provider value={mocks.notifications as any}>
                            {ui}
                        </NotificationContext.Provider>
                    </TaskContext.Provider>
                </FinanceContext.Provider>
            </AppContext.Provider>
        </AuthContext.Provider>
    );
};

describe('SettingsView - Security & MFA', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the Security section correctly', () => {
        renderWithContext(<SettingsView />);

        expect(screen.getByText('Identity & Security')).toBeInTheDocument();
        expect(screen.getByText('Two-Factor Authentication (2FA)')).toBeInTheDocument();
    });

    it('shows "Setup 2FA" button when MFA is disabled', () => {
        // Pass auth overrides to simulate mfaEnabled: false
        renderWithContext(<SettingsView />, {
            auth: { profile: { ...mockProfile, mfaEnabled: false } }
        });

        expect(screen.getByText('Setup 2FA')).toBeInTheDocument();
        expect(screen.queryByText('Disable')).not.toBeInTheDocument();
    });

    it('shows "Disable" button when MFA is enabled', () => {
        renderWithContext(<SettingsView />, {
            auth: { profile: { ...mockProfile, mfaEnabled: true } }
        });

        expect(screen.getByText('Disable')).toBeInTheDocument();
        expect(screen.queryByText('Setup 2FA')).not.toBeInTheDocument();
    });

    it('shows QR code setup flow when "Setup 2FA" is clicked', async () => {
        renderWithContext(<SettingsView />);

        const setupButton = screen.getByText('Setup 2FA');
        fireEvent.click(setupButton);

        expect(await screen.findByText('Configure Authenticator')).toBeInTheDocument();
        // Check for QR code alt text
        expect(screen.getByTitle('MFA QR Code')).toBeInTheDocument();
        // Check for Account Bound placeholder code
        expect(screen.getByText(/KVKF-KR3V-NM/)).toBeInTheDocument();
    });


    it('displays account notification banner when MFA is recommended', () => {
        renderWithContext(<SettingsView />, {
            auth: { accountNotifications: ['enable_2fa'] }
        });

        // Check for specific banner text
        expect(screen.getByText('MFA Recommended')).toBeInTheDocument();
        // Check for the "Enable 2FA" button within the banner (might have multiple "Enable 2FA" texts)
        const buttons = screen.getAllByText('Enable 2FA');
        expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('calls enrollMfa when verifying 2FA setup', async () => {
        // Mock window.alert
        vi.spyOn(window, 'alert').mockImplementation(() => { });

        const { auth } = createMockContexts({}, { accountNotifications: ['enable_2fa'] });
        renderWithContext(<SettingsView />, { auth });

        // Open Setup
        fireEvent.click(screen.getByText('Setup 2FA'));

        // Enter valid code to enable button
        const input = screen.getByPlaceholderText('000 000');
        fireEvent.change(input, { target: { value: '123456' } });

        // Find Verify Button (inside the expanded area)
        const verifyButton = await screen.findByText('Verify');
        expect(verifyButton).not.toBeDisabled();

        fireEvent.click(verifyButton);

        await waitFor(() => {
            expect(auth.enrollMfa).toHaveBeenCalledWith('123456');
        });
    });

    it('calls sendVerificationEmail when verifying email from banner', async () => {
        vi.spyOn(window, 'alert').mockImplementation(() => { });

        const { auth } = createMockContexts({}, { accountNotifications: ['verify_email'] });
        renderWithContext(<SettingsView />, {
            auth
        });

        expect(screen.getByText('Email Not Verified')).toBeInTheDocument();

        const verifyBtn = screen.getByText('Verify Now');
        fireEvent.click(verifyBtn);

        await waitFor(() => {
            expect(auth.sendVerificationEmail).toHaveBeenCalled();
        });
    });
});
