/**
 * AuthFormFields - Input fields for auth forms
 * 
 * Handles email, password, and MFA code inputs.
 */
// @ts-nocheck


import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

type AuthMode = 'login' | 'signup' | 'mfa' | 'reset';

interface AuthFormFieldsProps {
    authMode: AuthMode;
    setAuthMode: (mode: AuthMode) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    mfaCode: string;
    setMfaCode: (code: string) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    validationErrors: { email?: string; password?: string };
    setValidationErrors: (errors: { email?: string; password?: string }) => void;
}

export function AuthFormFields({
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    mfaCode,
    setMfaCode,
    showPassword,
    setShowPassword,
    validationErrors,
    setValidationErrors,
}: AuthFormFieldsProps) {
    if (authMode === 'mfa') {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center block">
                    Verification Code
                </label>
                {/* Removed hidden fields that previously confused autofill heuristics */}
                <div className="relative group w-full max-w-[280px] mx-auto px-4 sm:px-0">
                    <Lock className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        id="mfa-code" // Standard ID
                        name="mfa-code" // Standard name
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoFocus
                        autoComplete="one-time-code"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        placeholder="000000"
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => {
                            // Only allow numeric input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setMfaCode(value);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 dark:focus:border-blue-700 transition-all font-mono font-bold text-2xl tracking-[0.3em] text-center"
                    />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Open Authenticator App</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Enter the 6-digit code from Google Authenticator or your preferred app.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Email Field */}
            <div className="space-y-2">
                <label htmlFor="email" className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.email ? 'text-red-400' : 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300'}`} />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                        }}
                        placeholder="you@example.com"
                        autoComplete={authMode === 'login' ? 'username email' : 'email'}
                        className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.email ? 'border-red-400 focus:ring-red-500/10 focus:border-red-400' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-700'}`}
                    />
                </div>
                {validationErrors.email && (
                    <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.email}</p>
                )}
            </div>

            {/* Password Field */}
            {authMode !== 'reset' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        {authMode === 'login' && (
                            <button type="button" onClick={() => setAuthMode('reset')} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors">
                                Forgot?
                            </button>
                        )}
                    </div>
                    <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300'}`} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                            }}
                            placeholder="••••••••"
                            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
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
                    {authMode === 'signup' && password.length > 0 && <PasswordStrengthMeter password={password} />}
                </div>
            )}
        </>
    );
}
