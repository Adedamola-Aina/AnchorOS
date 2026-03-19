/**
 * SocialSignInButtons — AUTH-001, AUTH-005
 *
 * Google "Continue with Google" + Apple "Sign in with Apple" buttons.
 * Follows Anchor Design System (44px touch targets, mobile-first).
 */

import React from 'react';

interface Props {
    onGoogle: () => void;
    onApple: () => void;
    loading: boolean;
    error: string | null;
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
        </svg>
    );
}

function AppleIcon() {
    // Apple brand guidelines: black on light, white on dark.
    // Square viewBox (0 0 24 24) renders crisply at small sizes — BUG-109.
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="fill-black dark:fill-white"
        >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
    );
}

export const SocialSignInButtons: React.FC<Props> = ({ onGoogle, onApple, loading, error }) => {
    return (
        <div className="space-y-3">
            {/* Divider */}
            <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium shrink-0">or continue with</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Social error */}
            {error && (
                <p className="text-xs text-red-500 text-center -mt-1 animate-in fade-in">{error}</p>
            )}

            {/* Google */}
            <button
                type="button"
                disabled={loading}
                onClick={onGoogle}
                className="w-full min-h-[44px] flex items-center justify-center gap-3 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Continue with Google"
            >
                <GoogleIcon />
                Continue with Google
            </button>

            {/* Apple */}
            <button
                type="button"
                disabled={loading}
                onClick={onApple}
                className="w-full min-h-[44px] flex items-center justify-center gap-3 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Sign in with Apple"
            >
                <AppleIcon />
                Sign in with Apple
            </button>
        </div>
    );
};
