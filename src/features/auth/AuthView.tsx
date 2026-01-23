import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Check, Circle } from 'lucide-react';
import { AnchorLogo, ThemeToggle } from '../../components/shared';

interface AuthViewProps {
    authMode: 'login' | 'signup' | 'mfa' | 'reset';
    setAuthMode: (mode: 'login' | 'signup' | 'mfa' | 'reset') => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    authError: string;
    isAuthenticating: boolean;
    onSubmit: (e: React.FormEvent) => void;
    theme?: 'light' | 'dark';
    onThemeToggle?: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    isAuthenticating,
    onSubmit,
    theme = 'light',
    onThemeToggle
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    // Safeguard
    React.useEffect(() => {
        if (email.includes('test.mfa@anchor-os.dev')) {
            setEmail(email.replace('test.mfa@anchor-os.dev', ''));
        }
    }, [email, setEmail]);

    const getStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score++;
        if (pass.length >= 12) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
        return score;
    };

    const strength = getStrength(password);
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Extra Secure', 'Vault Layer'];
    const strengthColors = [
        { bar: 'bg-slate-300', text: 'text-slate-400' },
        { bar: 'bg-red-400', text: 'text-red-500' },
        { bar: 'bg-orange-400', text: 'text-orange-500' },
        { bar: 'bg-yellow-400', text: 'text-yellow-600' },
        { bar: 'bg-emerald-400', text: 'text-emerald-500' },
        { bar: 'bg-cyan-500', text: 'text-cyan-500' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
            {/* Left Panel - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-950 dark:to-black">
                {/* ... (Existing svg code not modified intentionally, assuming it renders) ... */}
                {/* Simplified for brevity in replace, but keeping structure if possible. 
                    However, keeping original content for illustration part is safer. 
                    I'll use exact replacement for the props and the form content.
                */}
                <div className="absolute inset-0 z-0">
                    <svg className="absolute bottom-0 left-0 w-full opacity-20 dark:opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '50%' }}>
                        <path fill="#22d3ee" d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,229.3C672,213,768,203,864,213.3C960,224,1056,256,1152,261.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L0,320Z" />
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-full opacity-30 dark:opacity-15" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '35%' }}>
                        <path fill="#06b6d4" d="M0,288L48,282.7C96,277,192,267,288,266.7C384,267,480,277,576,282.7C672,288,768,288,864,282.7C960,277,1056,267,1152,266.7C1248,267,1344,277,1392,282.7L1440,288L1440,320L0,320Z" />
                    </svg>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="relative w-64 h-64 flex items-center justify-center animate-in fade-in zoom-in duration-1000">
                        <AnchorLogo className="w-48 h-48 text-white/10 dark:text-cyan-400/10" strokeWidth={4} />
                    </div>
                </div>

                <div className="absolute top-12 left-12 right-12 z-20">
                    <div className="flex items-center gap-3 mb-8">
                        <AnchorLogo className="w-10 h-10 text-white" />
                        <span className="text-xl font-bold tracking-tight text-white transition-colors">Anchor</span>
                    </div>
                    <h2 className="text-4xl font-light text-white leading-tight">
                        Stay grounded.
                        <br />
                        <span className="text-cyan-400 font-medium">Track what matters.</span>
                    </h2>
                    <p className="mt-6 text-lg text-white/40 max-w-sm font-light">
                        Your personal operating system for habits, finances, and intentional living.
                    </p>
                </div>

                <div className="absolute bottom-12 left-12 z-20">
                    <p className="text-white/20 text-xs tracking-widest uppercase font-bold">Built for Intentionality</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 z-10 relative">
                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

                    <div className="mb-10 flex flex-col items-center lg:items-start">
                        <div className="flex items-center gap-3 mb-8">
                            <AnchorLogo className="w-10 h-10 text-slate-900 dark:text-white" />
                            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">Anchor</span>
                        </div>

                        <h2 className="text-3xl font-light text-slate-900 dark:text-white transition-colors">
                            {{ login: 'Welcome back', signup: 'Create your account', mfa: 'Security Challenge', reset: 'Reset Password' }[authMode]}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm transition-colors">
                            {{
                                login: 'Sign into your world',
                                signup: 'Start tracking habits and finances',
                                mfa: 'Please enter your 2FA verification code',
                                reset: 'We’ll send you a recovery link'
                            }[authMode]}
                        </p>
                    </div>

                    {authError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!email.trim()) {
                            setValidationErrors({ email: 'Email is required' });
                            return;
                        }
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            setValidationErrors({ email: 'Please enter a valid email' });
                            return;
                        }

                        // Only validate password if NOT resetting
                        if (authMode !== 'reset') {
                            if (!password) {
                                setValidationErrors({ password: 'Password is required' });
                                return;
                            }
                            if (authMode === 'signup' && password.length < 8) {
                                setValidationErrors({ password: 'Password must be at least 8 characters' });
                                return;
                            }
                        }

                        setValidationErrors({});
                        onSubmit(e);
                    }} className="space-y-5" autoComplete="off" noValidate>
                        {authMode === 'mfa' ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center block">
                                    Verification Code
                                </label>
                                <div className="relative group w-full max-w-[280px] mx-auto px-4 sm:px-0">
                                    <Lock className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                    <input
                                        type="text"
                                        name="mfaCode"
                                        inputMode="numeric"
                                        autoFocus
                                        autoComplete="off"
                                        placeholder="000 000"
                                        maxLength={6}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 dark:focus:border-blue-700 transition-all font-mono font-bold text-2xl tracking-[0.3em] text-center"
                                    />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Open Authenticator App
                                    </p>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                        Enter the 6-digit code from Google Authenticator or your preferred app.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.email ? 'text-red-400' : 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300'}`} />
                                        <input
                                            type="email"
                                            name="anchor_email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                                            }}
                                            placeholder="you@example.com"
                                            autoComplete="off"
                                            className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.email ? 'border-red-400 focus:ring-red-500/10 focus:border-red-400' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-700'}`}
                                        />
                                    </div>
                                    {validationErrors.email && (
                                        <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.email}</p>
                                    )}
                                </div>

                                {authMode !== 'reset' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                                Password
                                            </label>
                                            {authMode === 'login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setAuthMode('reset')}
                                                    className="text-[11px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors"
                                                >
                                                    Forgot?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300'}`} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="anchor_password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                                                }}
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                className={`w-full pl-12 pr-14 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.password ? 'border-red-400 focus:ring-red-500/10 focus:border-red-400' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-700'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {validationErrors.password && (
                                            <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.password}</p>
                                        )}

                                        {authMode === 'signup' && password.length > 0 && (
                                            <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                                {/* Password Strength UI (Kept same logic) */}
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Security Strength</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${strengthColors[strength].text}`}>
                                                        {strength >= 5 && <AnchorLogo className="w-3 h-3 animate-in zoom-in duration-300" />}
                                                        {strengthLabels[strength]}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-full flex-1 rounded-full transition-all duration-500 ${i < strength ? strengthColors[strength].bar : 'bg-transparent'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {[
                                                        { label: '12+ chars', met: password.length >= 12 },
                                                        { label: 'Uppercase', met: /[A-Z]/.test(password) },
                                                        { label: 'Number', met: /[0-9]/.test(password) },
                                                        { label: 'Symbol', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
                                                    ].map((req, i) => (
                                                        <span
                                                            key={i}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all duration-300 ${req.met
                                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                                }`}
                                                        >
                                                            {req.met ? (
                                                                <Check className="w-3 h-3" />
                                                            ) : (
                                                                <Circle className="w-3 h-3" />
                                                            )}
                                                            {req.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full py-4 px-6 bg-slate-800 dark:bg-white dark:text-slate-950 text-white font-bold rounded-2xl transition-all hover:bg-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {isAuthenticating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
                                    <span className="uppercase tracking-widest text-[10px] font-black">Processing...</span>
                                </>
                            ) : (
                                <>
                                    {authMode === 'login' ? <LogIn className="w-5 h-5" /> :
                                        authMode === 'signup' ? <UserPlus className="w-5 h-5" /> :
                                            authMode === 'reset' ? <Mail className="w-5 h-5" /> :
                                                <Lock className="w-5 h-5" />}
                                    <span className="uppercase tracking-widest text-[10px] font-black">
                                        {authMode === 'login' ? 'Sign In' :
                                            authMode === 'signup' ? 'Create Account' :
                                                authMode === 'reset' ? 'Send Link' :
                                                    'Verify Securely'}
                                    </span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col items-center gap-8">
                        {authMode !== 'mfa' && (
                            <button
                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
                            >
                                {authMode === 'login' ? (
                                    <>Don't have an account? <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign up</span></>
                                ) : authMode === 'signup' ? (
                                    <>Already have an account? <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign in</span></>
                                ) : (
                                    // Reset mode
                                    <>Back to <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign In</span></>
                                )}
                            </button>
                        )}
                        {authMode === 'mfa' && (
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
                            >
                                Back to <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign In</span>
                            </button>
                        )}

                        {/* Theme Toggle Slider */}
                        <div className="mt-auto pt-8 flex flex-col items-center animate-in fade-in duration-1000 delay-500">
                            <ThemeToggle variant="minimal" theme={theme} onToggle={() => onThemeToggle?.()} />
                            <p className="mt-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-50">
                                &copy; 2026 Anchor OS
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
