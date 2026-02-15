/**
 * AuthGate - Central authentication orchestrator
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Loading and gate UI components extracted to AuthGateParts.tsx
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import AuthView from '../../features/auth/AuthView';
import { getMultiFactorResolver, type MultiFactorResolver, type MultiFactorError } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { mapFirebaseError } from '../../utils/errorUtils';
import { AuthLoadingScreen, EmailVerificationGate, OnboardingGate } from './AuthGateParts';

interface AuthGateProps { children: React.ReactNode; }

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const { user, loading, profile, updateProfile, signIn, signUp, verifyMfa, logout, sendVerificationEmail, sendPasswordReset } = useAuth();
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
    const [loginAttempts, setLoginAttempts] = useState(() => { const stored = localStorage.getItem('anchor_login_attempts'); return stored ? parseInt(stored, 10) : 0; });
    const [lockoutUntil, setLockoutUntil] = useState(() => { const stored = localStorage.getItem('anchor_lockout_until'); return stored ? parseInt(stored, 10) : 0; });

    React.useEffect(() => {
        const handleExpiry = () => setAuthError('Session expired. Please sign in again.');
        window.addEventListener('anchor:session_expired', handleExpiry);
        const sessionActive = sessionStorage.getItem('anchor_session_active');
        if (sessionActive === 'true' && !user && !loading) { setAuthError('Session expired. Please sign in again.'); sessionStorage.removeItem('anchor_session_active'); }
        return () => window.removeEventListener('anchor:session_expired', handleExpiry);
    }, [user, loading]);

    React.useEffect(() => {
        if (!user && !loading) { setEmail(''); setPassword(''); setAuthError(''); setMfaResolver(null); setAuthMode('login'); if (location.pathname !== '/' && location.pathname !== '/accept-invite') navigate('/', { replace: true }); }
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
                    if (mfaResolver) { await verifyMfa(mfaResolver, mfaCode); setLoginAttempts(0); localStorage.setItem('anchor_login_attempts', '0'); }
                    else {
                        if (authMode === 'signup') {
                            const matches = [/[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password), /[!@#$%^&*(),.?":{}|<>]/.test(password)];
                            if (password.length < 12 || matches.includes(false)) { setAuthError('Password requirements not met.'); setIsAuthenticating(false); return; }
                            await signUp(email, password);
                        } else { await signIn(email, password); }
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

    const showOnboarding = !isTestUser && profile.onboardingComplete === false;
    if (showOnboarding) return <OnboardingGate show={true} />;

    return <>{children}</>;
};

export default AuthGate;
