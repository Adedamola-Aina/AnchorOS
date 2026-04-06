// @ts-nocheck
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
        Smartphone: () => <div data-testid="smartphone-icon">Smartphone</div>,
        QrCode: () => <div data-testid="qrcode-icon">QrCode</div>,
        Key: () => <div data-testid="key-icon">Key</div>,
        ArrowRight: () => <div data-testid="arrow-right">→</div>,
        ArrowLeft: () => <div data-testid="arrow-left">←</div>,
    };
});

// Mock QRCodeSVG
vi.mock('qrcode.react', () => ({
    QRCodeSVG: ({ value }: { value: string }) => <div data-testid="qr-code">{value}</div>,
}));

// Mock FamilyService
vi.mock('./FamilyService', () => ({
    checkOutgoingInvite: vi.fn(),
    finalizeFamilyConnection: vi.fn(),
}));

// Mock new security sub-components that have external dependencies
vi.mock('./components/PasskeySection', () => ({
    PasskeySection: () => <div data-testid="passkey-section">PasskeySection</div>,
}));
vi.mock('./components/AuthEventHistory', () => ({
    AuthEventHistory: () => <div data-testid="auth-event-history">AuthEventHistory</div>,
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
        generateMfaSecret: vi.fn().mockResolvedValue({ qrCodeUrl: 'otpauth://totp/Anchor?secret=KVKFKR3VNM', manualKey: 'KVKF-KR3V-NM' }),
        enrollMfa: vi.fn().mockResolvedValue(undefined),
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
        generateMfaSecret: vi.fn().mockResolvedValue({ qrCodeUrl: 'otpauth://totp/Anchor?secret=KVKFKR3VNM', manualKey: 'KVKF-KR3V-NM' }),
        enrollMfa: vi.fn().mockResolvedValue(undefined),
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
    return {
        ...render(
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
        ),
        mocks
    };
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

    it('shows the 3-step MFA wizard when "Setup 2FA" is clicked', async () => {
        const { mocks } = renderWithContext(<SettingsView />);

        const setupButton = screen.getByText('Setup 2FA');
        fireEvent.click(setupButton);

        // Wait for generateMfaSecret to be called and step 1 to appear
        await waitFor(() => {
            expect(mocks.auth.generateMfaSecret).toHaveBeenCalled();
        });

        // Step 1: Get an Authenticator App
        expect(await screen.findByText('Get an Authenticator App')).toBeInTheDocument();
        expect(screen.getByText('I have the app')).toBeInTheDocument();
    });

    it('navigates through the 3-step MFA wizard to step 2 (QR code)', async () => {
        const { mocks } = renderWithContext(<SettingsView />);

        // Click Setup 2FA
        fireEvent.click(screen.getByText('Setup 2FA'));
        await waitFor(() => expect(mocks.auth.generateMfaSecret).toHaveBeenCalled());

        // Proceed to step 2
        fireEvent.click(await screen.findByText('I have the app'));

        // Step 2: Scan the QR Code
        expect(await screen.findByText('Scan the QR Code')).toBeInTheDocument();
        expect(await screen.findByTestId('qr-code')).toBeInTheDocument();
        expect(screen.getByText("Can't scan?")).toBeInTheDocument();
    });

    // MFA banner test removed — onboarding flow now handles MFA recommendation

    it('calls enrollMfa when completing 3-step MFA wizard', async () => {
        const { mocks } = renderWithContext(<SettingsView />, {
            auth: { accountNotifications: [] }
        });

        // Click Setup 2FA
        fireEvent.click(screen.getByText('Setup 2FA'));
        await waitFor(() => expect(mocks.auth.generateMfaSecret).toHaveBeenCalled());

        // Step 1 -> Step 2
        fireEvent.click(await screen.findByText('I have the app'));
        await screen.findByText('Scan the QR Code');

        // Step 2 -> Step 3
        fireEvent.click(screen.getByText('Next'));
        await screen.findByText('Verify Setup');

        // Enter valid code
        const input = screen.getByPlaceholderText('000 000');
        fireEvent.change(input, { target: { value: '123456' } });

        // Click Verify & Enable
        const verifyButton = screen.getByText('Verify & Enable');
        expect(verifyButton).not.toBeDisabled();
        fireEvent.click(verifyButton);

        await waitFor(() => {
            expect(mocks.auth.enrollMfa).toHaveBeenCalledWith('123456');
        });
    });

    it('shows manual-key fallback and allows retry when QR is unavailable', async () => {
        const { mocks } = renderWithContext(<SettingsView />, {
            auth: {
                generateMfaSecret: vi.fn().mockResolvedValue({ qrCodeUrl: '', manualKey: 'ABCD-EFGH-IJKL' }),
            }
        });

        fireEvent.click(screen.getByText('Setup 2FA'));
        await waitFor(() => expect(mocks.auth.generateMfaSecret).toHaveBeenCalledTimes(1));

        fireEvent.click(await screen.findByText('I have the app'));
        expect(await screen.findByText('QR code unavailable. Use manual key below.')).toBeInTheDocument();
        expect(screen.getByText('ABCD-EFGH-IJKL')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Retry QR' }));
        await waitFor(() => expect(mocks.auth.generateMfaSecret).toHaveBeenCalledTimes(2));
    });

    // Email verification banner test removed — onboarding flow now handles this
});
