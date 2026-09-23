/**
 * OnboardingGoalStep - Step 3: Set a financial goal (PRD-007)
 *
 * Optional step in the onboarding flow that lets the user define
 * a simple savings or financial goal before creating their first commitment.
 */



import { Target, AlertCircle } from 'lucide-react';
import { toCents } from '../../../utils/moneyUtils';

interface OnboardingGoalStepProps {
    goalTitle: string;
    setGoalTitle: (title: string) => void;
    goalAmount: string;
    setGoalAmount: (amount: string) => void;
    goalType: GoalType;
    setGoalType: (type: GoalType) => void;
    loading: boolean;
    onSubmit: () => void;
    onSkip: () => void;
    onBack: () => void;
}

export type GoalType = 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'other';

const GOAL_SUGGESTIONS = [
    { title: 'Emergency Fund', type: 'emergency_fund' },
    { title: 'Save for Vacation', type: 'savings' },
    { title: 'Pay Off Debt', type: 'debt_payoff' },
    { title: 'Start Investing', type: 'investment' },
] as const;

const GOAL_TYPES = [
    { value: 'savings', label: 'Savings' },
    { value: 'debt_payoff', label: 'Debt Payoff' },
    { value: 'investment', label: 'Investment' },
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'other', label: 'Other' },
] as const;

export function OnboardingGoalStep({
    goalTitle, setGoalTitle, goalAmount, setGoalAmount,
    goalType, setGoalType, loading, onSubmit, onSkip, onBack,
}: OnboardingGoalStepProps) {
    // RA-13 (#171): `toCents` returns 0 for unparseable input, and the rules
    // require a positive target, so validate here instead of letting the write
    // fail with a generic toast.
    const trimmedAmount = goalAmount.trim();
    const amountCents = toCents(trimmedAmount);
    const amountError = trimmedAmount.length > 0 && amountCents <= 0
        ? 'Enter a valid amount greater than zero.'
        : null;
    const canSubmit = goalTitle.trim().length > 0 && trimmedAmount.length > 0 && amountCents > 0 && !loading;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Set a Goal</h2>
                    <p className="text-slate-500 text-sm">What are you working toward financially?</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Goal Name</label>
                    <input
                        type="text"
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="e.g. Emergency Fund, House Down Payment"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {GOAL_SUGGESTIONS.map(s => (
                        <button
                            key={s.title}
                            onClick={() => { setGoalTitle(s.title); setGoalType(s.type); }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {s.title}
                        </button>
                    ))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Amount</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        aria-invalid={amountError ? true : undefined}
                        className={`w-full p-4 bg-white dark:bg-slate-900 border rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            amountError
                                ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500'
                        }`}
                        placeholder="e.g. 500,000"
                    />
                    {amountError && (
                        <p role="alert" className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {amountError}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Goal Type</label>
                    <div className="flex flex-wrap gap-2">
                        {GOAL_TYPES.map(gt => (
                            <button
                                key={gt.value}
                                type="button"
                                onClick={() => setGoalType(gt.value)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    goalType === gt.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {gt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                    {loading ? 'Saving...' : 'Set Goal & Continue'}
                </button>

                <div className="text-center flex justify-center gap-4">
                    <button onClick={onBack} className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">← Back</button>
                    <button onClick={onSkip} aria-label="Skip for now — you can add this later" className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Skip for now</button>
                </div>
            </div>
        </div>
    );
}
