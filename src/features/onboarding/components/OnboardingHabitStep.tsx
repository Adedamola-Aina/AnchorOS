/**
 * OnboardingHabitStep - Step 3: Create first commitment
 */

import { CheckCircle2, Sparkles } from 'lucide-react';

interface OnboardingHabitStepProps {
    taskTitle: string;
    setTaskTitle: (title: string) => void;
    loading: boolean;
    onSubmit: () => void;
    onSkip: () => void;
}

const SUGGESTIONS = ['Drink 2L Water', 'Read 15 Mins', 'Walk 5000 Steps', 'Review Finances'];

export function OnboardingHabitStep({ taskTitle, setTaskTitle, loading, onSubmit, onSkip }: OnboardingHabitStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">One Small Habit</h2>
                    <p className="text-slate-500 text-sm">Consistency starts with one daily action.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">I commit to...</label>
                    <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="e.g. Drink water, Read pages, Exercise" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => setTaskTitle(s)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {s}
                        </button>
                    ))}
                </div>

                <button onClick={onSubmit} disabled={!taskTitle || loading}
                    className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    {loading ? 'Committing...' : 'Finish Setup'} <Sparkles className="w-4 h-4" />
                </button>

                <div className="text-center">
                    <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Skip for now →</button>
                </div>
            </div>
        </div>
    );
}
