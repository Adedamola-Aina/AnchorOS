/**
 * GettingStartedWelcome - Step 1: Welcome + set display name
 * Replaces OnboardingWelcome with editable name field.
 */
// @ts-nocheck


import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnchorLogo } from '../../../components/shared';

interface GettingStartedWelcomeProps {
  userName: string;
  onStart: (name: string) => void;
  onSkip: () => void;
}

export function GettingStartedWelcome({ userName, onStart, onSkip }: GettingStartedWelcomeProps) {
  const [displayName, setDisplayName] = useState(userName);

  return (
    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-center mb-6">
        <AnchorLogo className="w-20 h-20 text-slate-900 dark:text-white" />
      </div>

      <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">
        Welcome to Anchor OS.
      </h1>

      <p className="text-body text-slate-500 dark:text-slate-400 leading-relaxed">
        Your personal system for tracking finances and daily commitments —
        designed to be calm, focused, and always in your corner.
      </p>

      <div className="text-left max-w-xs mx-auto">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          What should we call you?
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          placeholder="Your name"
          maxLength={30}
        />
      </div>

      <button
        onClick={() => onStart(displayName.trim() || userName)}
        className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
      >
        Let&apos;s Begin
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <div>
        <button
          onClick={onSkip}
          className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}
