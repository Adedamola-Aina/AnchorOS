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
            className="w-full py-4 px-6 bg-slate-800 dark:bg-white dark:text-slate-950 text-white font-bold rounded-2xl transition-all hover:bg-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-3"
        >
            {isAuthenticating ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
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
