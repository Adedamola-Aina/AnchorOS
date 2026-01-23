import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import AuthView from '../../features/auth/AuthView';
import { OnboardingView } from '../../features/onboarding/OnboardingView';
import { AnchorLogo } from '../shared';
import { getMultiFactorResolver, type MultiFactorResolver } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { mapFirebaseError } from '../../utils/errorUtils';

interface AuthGateProps {
    children: React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const {
        user, loading, profile, updateProfile, signIn, signUp, verifyMfa, logout, sendVerificationEmail, sendPasswordReset
    } = useAuth();
    const { accounts } = useFinance();
    const { tasks } = useTasks();
    const { showToast } = useNotifications();

    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'mfa' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    const [authError, setAuthError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Rate Limiting State
    const [loginAttempts, setLoginAttempts] = useState(() => {
        const stored = localStorage.getItem('anchor_login_attempts');
        return stored ? parseInt(stored, 10) : 0;
    });
    const [lockoutUntil, setLockoutUntil] = useState(() => {
        const stored = localStorage.getItem('anchor_lockout_until');
        return stored ? parseInt(stored, 10) : 0;
    });

    // Session Recovery / Expiry
    React.useEffect(() => {
        const sessionActive = sessionStorage.getItem('anchor_session_active');
        if (sessionActive === 'true' && !user && !loading) {
            setAuthError('Session expired. Please sign in again.');
            sessionStorage.removeItem('anchor_session_active');
        }
    }, [user, loading]);

    // Clear credentials on logout
    React.useEffect(() => {
        if (!user) {
            setEmail('');
            setPassword('');
            setAuthError('');
            setMfaResolver(null);
            if (authMode !== 'reset') setAuthMode('login');
        }
    }, [user]);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-6">
            <div className="relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-slate-800 dark:border-white opacity-20"></div>
                <AnchorLogo className="absolute w-10 h-10 text-slate-800 dark:text-white animate-pulse" />
            </div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 animate-pulse">Initializing Anchor OS</p>
        </div>
    );

    if (!user) return (
        <AuthView
            authMode={mfaResolver ? 'mfa' : authMode}
            setAuthMode={setAuthMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            authError={authError}
            isAuthenticating={isAuthenticating}
            theme={profile?.theme || 'light'}
            onThemeToggle={() => updateProfile({ theme: profile.theme === 'dark' ? 'light' : 'dark' })}
            onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                setAuthError('');

                // Check Lockout
                if (Date.now() < lockoutUntil) {
                    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
                    setAuthError(`Too many attempts. Please try again in ${remaining}s.`);
                    return;
                }

                setIsAuthenticating(true);
                try {
                    if (authMode === 'reset') {
                        await sendPasswordReset(email);
                        showToast('Password reset email sent!', 'success');
                        setAuthMode('login');
                        setAuthError(''); // Clear any errors
                        return;
                    }

                    if (mfaResolver) {
                        const mfaCode = (form.elements.namedItem('mfaCode') as HTMLInputElement).value;
                        await verifyMfa(mfaResolver, mfaCode);
                        // Success - reset attempts
                        setLoginAttempts(0);
                        localStorage.setItem('anchor_login_attempts', '0');
                    } else {
                        if (authMode === 'signup') {
                            const minLength = 12;
                            const matches = [
                                /[A-Z]/.test(password),
                                /[a-z]/.test(password),
                                /[0-9]/.test(password),
                                /[!@#$%^&*(),.?":{}|<>]/.test(password)
                            ];
                            if (password.length < minLength || matches.includes(false)) {
                                setAuthError('Password requirements not met.');
                                setIsAuthenticating(false);
                                return;
                            }
                            await signUp(email, password);
                        } else {
                            await signIn(email, password);
                        }
                        // Success - reset attempts
                        setLoginAttempts(0);
                        localStorage.setItem('anchor_login_attempts', '0');
                    }
                } catch (err: unknown) {
                    // Handle Errors & Rate Limiting
                    if ((err as any).code === 'auth/multi-factor-auth-required') {
                        setMfaResolver(getMultiFactorResolver(auth, err as any));
                        setLoginAttempts(0); // Valid credentials, just need MFA
                    } else {
                        // Increment failed attempts
                        const newAttempts = loginAttempts + 1;
                        setLoginAttempts(newAttempts);
                        localStorage.setItem('anchor_login_attempts', newAttempts.toString());

                        if (newAttempts >= 5) {
                            const lockoutTime = Date.now() + 60 * 1000; // 1 minute
                            setLockoutUntil(lockoutTime);
                            localStorage.setItem('anchor_lockout_until', lockoutTime.toString());
                            setAuthError('Too many failed attempts. Login locked for 1 minute.');
                        } else {
                            let msg = mapFirebaseError(err);
                            if (msg.includes('Incorrect email or password')) {
                                const env = import.meta.env.VITE_APP_ENV;
                                msg = (env === 'production')
                                    ? 'Incorrect email or password.'
                                    : 'Incorrect email or password. Remember: Non-production accounts are separate.';
                            }
                            setAuthError(msg);
                        }
                    }
                } finally {
                    setIsAuthenticating(false);
                }
            }}
        />
    );

    // Email Verification Gate
    const env = import.meta.env.VITE_APP_ENV;
    const isDevOrStaging = env === 'development' || env === 'staging';
    const isTestUser = user.email === 'test@anchor-os.com' || user.email?.endsWith('@anchor-os.com');

    if (!user.emailVerified && !isDevOrStaging && !isTestUser) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white p-4">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-400">
                        <Mail className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Verify your Email</h2>
                        <p className="text-slate-400">
                            We've sent a verification link to <span className="text-white font-medium">{user.email}</span>.
                            Please check your inbox to continue.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={async () => {
                                await sendVerificationEmail();
                                showToast('Verification email sent!', 'success');
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Resend Email
                        </button>
                        <button onClick={() => window.location.reload()} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                            I've Verified It
                        </button>
                        <button onClick={logout} className="w-full text-slate-500 hover:text-white text-sm">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Onboarding Gate
    const isBrandNew = accounts.length === 0 && tasks.length === 0;
    const showOnboarding = !isTestUser && ((profile.onboardingComplete === false) || (isBrandNew && profile.onboardingComplete !== true));

    if (showOnboarding) {
        return <OnboardingView />;
    }

    return <>{children}</>;
};

export default AuthGate;
