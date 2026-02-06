/**
 * OnboardingWelcome - Step 1: Welcome screen
 */

import { ArrowRight } from 'lucide-react';
import { AnchorLogo } from '../../../components/shared';

interface OnboardingWelcomeProps {
    userName: string;
    onStart: () => void;
    onSkip: () => void;
}

export function OnboardingWelcome({ userName, onStart, onSkip }: OnboardingWelcomeProps) {
    return (
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-center mb-6">
                <AnchorLogo className="w-20 h-20 text-slate-900 dark:text-white" />
            </div>
            <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">
                Welcome aboard, <span className="text-blue-500">{userName}</span>.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                Anchor OS is designed to organize your financial life and daily commitments in one unified system.
            </p>
            <button
                onClick={onStart}
                className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
            >
                Start Setup
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div>
                <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    Skip for now →
                </button>
            </div>
        </div>
    );
}
