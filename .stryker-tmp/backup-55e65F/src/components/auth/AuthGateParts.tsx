/**
 * AuthGate Loading & Gate Components
 * Extracted from AuthGate.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Mail } from 'lucide-react';
import { AnchorLogo } from '../shared';

const LazyOnboardingView = React.lazy(() =>
    import('../../features/onboarding/OnboardingView').then((module) => ({ default: module.OnboardingView }))
);

export const AuthLoadingScreen: React.FC = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-6">
        <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-slate-800 dark:border-white opacity-20"></div>
            <AnchorLogo className="absolute w-10 h-10 text-slate-800 dark:text-white animate-pulse" />
        </div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 animate-pulse">Initializing Anchor OS</p>
    </div>
);

interface EmailVerificationGateProps { email: string; onResend: () => void; onRefresh: () => void; onLogout: () => void; }
export const EmailVerificationGate: React.FC<EmailVerificationGateProps> = ({ email, onResend, onRefresh, onLogout }) => (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto text-primary-400"><Mail className="w-8 h-8" /></div>
            <div>
                <h2 className="text-h2 lg:text-h2-lg mb-2">Verify your Email</h2>
                <p className="text-slate-400">We've sent a verification link to <span className="text-white font-medium">{email}</span>. Please check your inbox to continue.</p>
            </div>
            <div className="space-y-3">
                <button onClick={onResend} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors">Resend Email</button>
                <button onClick={onRefresh} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">I've Verified It</button>
                <button onClick={onLogout} className="w-full text-slate-500 hover:text-white text-sm">Sign Out</button>
            </div>
        </div>
    </div>
);

interface OnboardingGateProps { show: boolean; }
export const OnboardingGate: React.FC<OnboardingGateProps> = ({ show }) => {
    if (!show) return null;
    return (
        <React.Suspense fallback={<AuthLoadingScreen />}>
            <LazyOnboardingView />
        </React.Suspense>
    );
};
