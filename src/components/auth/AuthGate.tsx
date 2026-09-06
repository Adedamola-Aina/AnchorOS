/**
 * AuthGate - Central authentication orchestrator
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Loading and gate UI components extracted to AuthGateParts.tsx
 */
// @ts-nocheck


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import AuthView from '../../features/auth/AuthView';
import { getMultiFactorResolver, getRedirectResult, type MultiFactorResolver, type MultiFactorError } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { mapFirebaseError } from '../../utils/errorUtils';
import { AuthLoadingScreen, EmailVerificationGate } from './AuthGateParts';

// PERFORMANCE: the onboarding shell pulls in Finance/Task/Fabric providers and
// the onboarding feature bundle — load it lazily, only when onboarding shows.
const LazyOnboardingShell = React.lazy(() =>
    import('./OnboardingShell').then((module) => ({ default: module.OnboardingShell }))
);
import { consumeMfaRecoveryCode } from '../../api/MfaRecoveryApi';

// PLT-001: Timeout wrapper for auth calls that may hang in Capacitor WebView
const withTimeout = <T,>(promise: Promise<T>, ms = 15000): Promise<T> =>
    Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Authentication timed out. Please check your connection and try again.')), ms))]);

const isRecoveryCode = (value: string): boolean => /^[A-Z0-9]{8}$/.test(value.trim().toUpperCase());

interface AuthGateProps { children: React.ReactNode; }

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const { user, loading, profile, profileLoaded, updateProfile, signIn, signUp, verifyMfa, logout, sendVerificationEmail, sendPasswordReset } = useAuth();
    const { showToast } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();

    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'mfa' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    const [authError, setAuthError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(() => {
        const lockout = parseInt(localStorage.getItem('anchor_lockout_until') || '0', 10);
        if (lockout && Date.now() >= lockout) { localStorage.removeItem('anchor_login_attempts'); localStorage.removeItem('anchor_lockout_until'); return 0; }
        return parseInt(localStorage.getItem('anchor_login_attempts') || '0', 10);
    });
    const [lockoutUntil, setLockoutUntil] = useState(() => {
        const stored = parseInt(localStorage.getItem('anchor_lockout_until') || '0', 10);
        if (stored && Date.now() >= stored) { localStorage.removeItem('anchor_lockout_until'); return 0; }
        return stored;
    });

    React.useEffect(() => {
        const handleExpiry = () => setAuthError('Session expired. Please sign in again.');
        window.addEventListener('anchor:session_expired', handleExpiry);
        const sessionActive = sessionStorage.getItem('anchor_session_active');
        if (sessionActive === 'true' && !user && !loading) {
            sessionStorage.removeItem('anchor_session_active');
            queueMicrotask(() => setAuthError('Session expired. Please sign in again.'));
        }
        return () => window.removeEventListener('anchor:session_expired', handleExpiry);
    }, [user, loading]);

    // AUTH-001/005: Handle redirect result from native Capacitor (Google/Apple)
    React.useEffect(() => {
        getRedirectResult(auth).catch(() => undefined);
    }, []);

    React.useEffect(() => {
        if (!user && !loading) {
            queueMicrotask(() => {
                setEmail('');
                setPassword('');
                setMfaResolver(null);
                setMfaCode('');
                setAuthMode('login');
            });
            if (location.pathname !== '/login' && location.pathname !== '/accept-invite') {
                navigate('/login', { replace: true });
            }
        }
    }, [user, loading, location.pathname, navigate]);

    if (loading) return <AuthLoadingScreen />;

    if (!user) return (
        <AuthView authMode={mfaResolver ? 'mfa' : authMode} setAuthMode={setAuthMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} mfaCode={mfaCode} setMfaCode={setMfaCode} authError={authError} isAuthenticating={isAuthenticating} theme={profile?.theme || 'light'} onSetTheme={(theme) => updateProfile({ theme })}
            onSubmit={async (e) => {
                e.preventDefault(); setAuthError('');
                if (Date.now() < lockoutUntil) { setAuthError(`Too many attempts. Please try again in ${Math.ceil((lockoutUntil - Date.now()) / 1000)}s.`); return; }
                setIsAuthenticating(true);
                try {
                    if (authMode === 'reset') { await sendPasswordReset(email); showToast('Password reset email sent!', 'success'); setAuthMode('login'); setAuthError(''); return; }
                    if (mfaResolver) {
                        const normalizedCode = mfaCode.trim().toUpperCase();
                        if (isRecoveryCode(normalizedCode)) {
                            await consumeMfaRecoveryCode(email, normalizedCode);
                            setMfaResolver(null);
                            setMfaCode('');
                            setAuthMode('login');
                            showToast('Recovery code accepted. Sign in again to continue.', 'success');
                            setLoginAttempts(0);
                            localStorage.setItem('anchor_login_attempts', '0');
                            return;
                        }

                        await verifyMfa(mfaResolver, normalizedCode);
                        setLoginAttempts(0);
                        localStorage.setItem('anchor_login_attempts', '0');
                    }
                    else {
                        if (authMode === 'signup') {
                            const matches = [/[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password), /[!@#$%^&*(),.?":{}|<>]/.test(password)];
                            if (password.length < 12 || matches.includes(false)) { setAuthError('Password requirements not met.'); setIsAuthenticating(false); return; }
                            await withTimeout(signUp(email, password));
                        } else { await withTimeout(signIn(email, password)); }
                        setLoginAttempts(0); localStorage.setItem('anchor_login_attempts', '0');
                    }
                } catch (err: unknown) {
                    if ((err as MultiFactorError).code === 'auth/multi-factor-auth-required') { setMfaResolver(getMultiFactorResolver(auth, err as MultiFactorError)); setMfaCode(''); setLoginAttempts(0); }
                    else {
                        const newAttempts = loginAttempts + 1; setLoginAttempts(newAttempts); localStorage.setItem('anchor_login_attempts', newAttempts.toString());
                        if (newAttempts >= 5) { const lockoutTime = Date.now() + 60000; setLockoutUntil(lockoutTime); localStorage.setItem('anchor_lockout_until', lockoutTime.toString()); setAuthError('Too many failed attempts. Login locked for 1 minute.'); }
                        else { let msg = mapFirebaseError(err); if (msg.includes('Incorrect email or password')) { msg = import.meta.env.VITE_APP_ENV === 'production' ? 'Incorrect email or password.' : 'Incorrect email or password. Remember: Non-production accounts are separate.'; } setAuthError(msg); }
                    }
                } finally { setIsAuthenticating(false); }
            }} />
    );

    // Gates
    const env = import.meta.env.VITE_APP_ENV;
    const isDevOrStaging = env === 'development' || env === 'staging';
    const isTestUser = user.email === 'test@anchor-os.com' || user.email?.endsWith('@anchor-os.com');
    if (!user.emailVerified && !isDevOrStaging && !isTestUser) return <EmailVerificationGate email={user.email!} onResend={async () => { await sendVerificationEmail(); showToast('Verification email sent!', 'success'); }} onRefresh={() => window.location.reload()} onLogout={logout} />;

    const showOnboarding = !isTestUser && profileLoaded && profile.onboardingComplete === false;
    if (showOnboarding) return (
        <React.Suspense fallback={<AuthLoadingScreen />}>
            <LazyOnboardingShell />
        </React.Suspense>
    );

    return <>{children}</>;
};

export default AuthGate;
