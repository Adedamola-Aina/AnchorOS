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
    // Apple brand guidelines: black on light backgrounds, white on dark backgrounds.
    // We use a <title> for accessibility and explicit CSS class for colour.
    return (
        <svg
            width="16"
            height="20"
            viewBox="0 0 814 1000"
            aria-hidden="true"
            className="fill-black dark:fill-white"
        >
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-164-39.3c-76 0-103.7 40.8-165.9 40.8s-105.8-57.8-155-127C46 475 0 327.5 0 186.3c0-104.7 36.7-199.5 103.3-268.7C147 72 211.2 40 278.4 40c64.1 0 116.1 41.9 156 41.9 37.8 0 97.9-43.1 170.3-43.1 27.5 0 105.8 2.6 164.1 97.1zM468.4 60.6c-21.4 23.8-56.9 41.9-97.3 41.9-5.8 0-11.7-.6-17.6-1.3-1.3-5.8-1.9-11.7-1.9-18.2 0-22.5 9-47.6 27.1-67.6 18.2-20.7 50.3-36.9 78.7-38.9 1.3 6.4 1.9 12.9 1.9 19.4 0 23.8-8.4 47.6-20.9 64.7z" />
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
