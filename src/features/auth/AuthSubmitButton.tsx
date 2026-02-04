/**
 * AuthSubmitButton - Submit button for auth forms
 * 
 * Displays appropriate icon and text based on auth mode.
 */

import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'mfa' | 'reset';

interface AuthSubmitButtonProps {
    authMode: AuthMode;
    isAuthenticating: boolean;
}

export function AuthSubmitButton({ authMode, isAuthenticating }: AuthSubmitButtonProps) {
    const icons = {
        login: <LogIn className="w-5 h-5" />,
        signup: <UserPlus className="w-5 h-5" />,
        reset: <Mail className="w-5 h-5" />,
        mfa: <Lock className="w-5 h-5" />
    };

    const labels = {
        login: 'Sign In',
        signup: 'Create Account',
        reset: 'Send Link',
        mfa: 'Verify Securely'
    };

    return (
        <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-4 px-6 bg-foreground dark:bg-foreground-dark dark:text-surface-1-dark text-white font-bold rounded-2xl transition-all hover:bg-foreground/90 dark:hover:bg-foreground-dark/90 disabled:opacity-50 shadow-xl shadow-foreground/10 dark:shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-3"
        >
            {isAuthenticating ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/20 dark:border-foreground-dark/20 border-t-white dark:border-t-foreground-dark rounded-full animate-spin" />
                    <span className="uppercase tracking-widest text-[10px] font-black">Processing...</span>
                </>
            ) : (
                <>
                    {icons[authMode]}
                    <span className="uppercase tracking-widest text-[10px] font-black">{labels[authMode]}</span>
                </>
            )}
        </button>
    );
}
