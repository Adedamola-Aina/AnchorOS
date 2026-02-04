/**
 * AuthFormFields - Input fields for auth forms
 * 
 * Handles email, password, and MFA code inputs.
 */

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
                <label className="text-[11px] font-black text-muted dark:text-muted-dark uppercase tracking-[0.2em] text-center block">
                    Verification Code
                </label>
                {/* Hidden fields to confuse autofill */}
                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />
                <div className="relative group w-full max-w-[280px] mx-auto px-4 sm:px-0">
                    <Lock className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        id="mfa-code-input"
                        name="otp-code"
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
                        className="w-full pl-12 pr-4 py-4 bg-surface-2 dark:bg-surface-1-dark border-2 border-border-subtle dark:border-border-dark rounded-3xl text-foreground dark:text-foreground-dark placeholder-muted focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 dark:focus:border-primary-700 transition-all font-mono font-bold text-2xl tracking-[0.3em] text-center"
                    />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Open Authenticator App</p>
                    <p className="text-xs text-muted max-w-xs mx-auto">Enter the 6-digit code from Google Authenticator or your preferred app.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted dark:text-muted-dark uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.email ? 'text-danger-400' : 'text-muted group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400'}`} />
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
                        className={`w-full pl-12 pr-4 py-3.5 bg-surface-1 dark:bg-surface-1-dark border rounded-2xl text-foreground dark:text-foreground-dark placeholder-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.email ? 'border-danger-400 focus:ring-danger-500/10 focus:border-danger-400' : 'border-border-subtle dark:border-border-dark focus:ring-muted/5 focus:border-primary-400 dark:focus:border-primary-600'}`}
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
                        <label className="text-[11px] font-bold text-muted dark:text-muted-dark uppercase tracking-widest ml-1">Password</label>
                        {authMode === 'login' && (
                            <button type="button" onClick={() => setAuthMode('reset')} className="text-[11px] font-bold text-primary-500 hover:text-primary-600 uppercase tracking-wider transition-colors">
                                Forgot?
                            </button>
                        )}
                    </div>
                    <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.password ? 'text-danger-400' : 'text-muted group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400'}`} />
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
                            className={`w-full pl-12 pr-14 py-3.5 bg-surface-1 dark:bg-surface-1-dark border rounded-2xl text-foreground dark:text-foreground-dark placeholder-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.password ? 'border-danger-400 focus:ring-danger-500/10 focus:border-danger-400' : 'border-border-subtle dark:border-border-dark focus:ring-muted/5 focus:border-primary-400 dark:focus:border-primary-600'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted hover:text-foreground dark:hover:text-foreground-dark transition-colors rounded-xl hover:bg-surface-3 dark:hover:bg-surface-3-dark"
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
