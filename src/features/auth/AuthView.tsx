/**
 * AuthView - Main authentication page
 * 
 * Orchestrates the login, signup, MFA, and reset password flows.
 * 
 * Refactored per CLAUDE.md 200-line rule.
 * Extracted: AuthLeftPanel, AuthFormFields, PasswordStrengthMeter, AuthSubmitButton
 */

import React, { useState } from 'react';
import { AnchorLogo, ThemeToggle, type Theme } from '../../components/shared';
import { AuthLeftPanel } from './AuthLeftPanel';
import { AuthFormFields } from './AuthFormFields';
import { AuthSubmitButton } from './AuthSubmitButton';
import { useKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';

interface AuthViewProps {
    authMode: 'login' | 'signup' | 'mfa' | 'reset';
    setAuthMode: (mode: 'login' | 'signup' | 'mfa' | 'reset') => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    mfaCode: string;
    setMfaCode: (code: string) => void;
    authError: string;
    isAuthenticating: boolean;
    onSubmit: (e: React.FormEvent) => void;
    theme?: Theme;
    onSetTheme?: (theme: Theme) => void;
}

const titles = { login: 'Welcome back', signup: 'Create your account', mfa: 'Security Challenge', reset: 'Reset Password' };
const subtitles = {
    login: 'Sign into your world', signup: 'Start tracking habits and finances', mfa: 'Please enter your 2FA verification code', reset: "We'll send you a recovery link"
};

const AuthView: React.FC<AuthViewProps> = ({
    authMode, setAuthMode, email, setEmail, password, setPassword,
    mfaCode, setMfaCode, authError, isAuthenticating, onSubmit, theme = 'light', onSetTheme
}) => {
    // KB-001: Ensure keyboard doesn't cover inputs on mobile
    useKeyboardAvoidance();
    
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);
    const attemptsRef = React.useRef<{ count: number; firstAttempt: number }>({ count: 0, firstAttempt: 0 });

    React.useEffect(() => {
        if (email.includes('test.mfa@anchor-os.dev')) {
            setEmail(email.replace('test.mfa@anchor-os.dev', ''));
        }
    }, [email, setEmail]);

    const handleRateLimitedSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = Date.now();
        const windowMs = 60000;
        const maxAttempts = 5;

        if (now - attemptsRef.current.firstAttempt > windowMs) {
            attemptsRef.current = { count: 0, firstAttempt: now };
            setRateLimitError(null);
        }
        if (attemptsRef.current.count >= maxAttempts) {
            const waitSeconds = Math.ceil((windowMs - (now - attemptsRef.current.firstAttempt)) / 1000);
            setRateLimitError(`Too many attempts. Please wait ${waitSeconds}s.`);
            return;
        }
        attemptsRef.current.count++;
        onSubmit(e);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { setValidationErrors({ email: 'Email is required' }); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setValidationErrors({ email: 'Please enter a valid email' }); return; }
        if (authMode !== 'reset') {
            if (!password) { setValidationErrors({ password: 'Password is required' }); return; }
            if (authMode === 'signup' && password.length < 8) { setValidationErrors({ password: 'Password must be at least 8 characters' }); return; }
        }
        setValidationErrors({});
        handleRateLimitedSubmit(e);
    };

    return (
        <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
            <AuthLeftPanel />

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 z-10 relative">
                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center lg:items-start">
                        <div className="flex items-center gap-3 mb-8">
                            <AnchorLogo className="w-10 h-10 text-slate-900 dark:text-white" />
                            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">Anchor</span>
                        </div>
                        <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white transition-colors font-light">{titles[authMode]}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm transition-colors">{subtitles[authMode]}</p>
                    </div>

                    {/* Errors */}
                    {authError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {authError}
                        </div>
                    )}
                    {rateLimitError && (
                        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl text-orange-600 dark:text-orange-400 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {rateLimitError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                        <AuthFormFields
                            authMode={authMode} setAuthMode={setAuthMode} email={email} setEmail={setEmail}
                            password={password} setPassword={setPassword} mfaCode={mfaCode} setMfaCode={setMfaCode}
                            showPassword={showPassword} setShowPassword={setShowPassword}
                            validationErrors={validationErrors} setValidationErrors={setValidationErrors}
                        />
                        <AuthSubmitButton authMode={authMode} isAuthenticating={isAuthenticating} />
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center flex flex-col items-center gap-8">
                        {authMode !== 'mfa' ? (
                            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group">
                                {authMode === 'login' ? <>Don't have an account? <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign up</span></> :
                                    authMode === 'signup' ? <>Already have an account? <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign in</span></> :
                                        <>Back to <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign In</span></>}
                            </button>
                        ) : (
                            <button onClick={() => window.location.reload()} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group">
                                Back to <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign In</span>
                            </button>
                        )}

                        <div className="mt-auto pt-8 flex flex-col items-center animate-in fade-in duration-1000 delay-500">
                            <ThemeToggle variant="minimal" theme={theme} onSetTheme={(t) => onSetTheme?.(t)} />
                            <p className="mt-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-50">&copy; 2026 Anchor OS</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
