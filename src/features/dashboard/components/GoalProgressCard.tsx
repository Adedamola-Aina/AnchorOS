/**
 * GoalProgressCard — surfaces the financial goals saved during onboarding.
 *
 * RA-12 (#168): onboarding step 3 writes `users/{uid}/goals`, but the product
 * never read it back. This renders those goals (title, target, progress) with
 * an empty state.
 *
 * Progress is deliberately read-only: goals have no contribution model yet, so
 * the bar reflects the stored `currentAmountCents` (written as 0 by onboarding)
 * rather than implying live funding.
 */

import { Target } from 'lucide-react';
import type { AnchorGoal } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/format';
import { EmptyState } from '../../../components/shared/EmptyState';

interface GoalProgressCardProps {
    goals: AnchorGoal[];
    isLoading?: boolean;
}

const GOAL_TYPE_LABELS: Record<AnchorGoal['goalType'], string> = {
    savings: 'Savings',
    debt_payoff: 'Debt Payoff',
    investment: 'Investment',
    emergency_fund: 'Emergency Fund',
    other: 'Other',
};

export const getGoalProgressPercent = (goal: AnchorGoal): number => {
    if (goal.targetAmountCents <= 0) return 0;
    const percent = Math.round((goal.currentAmountCents / goal.targetAmountCents) * 100);
    return Math.min(100, Math.max(0, percent));
};

export function GoalProgressCard({ goals, isLoading = false }: GoalProgressCardProps) {
    return (
        <div className="glass-card p-6" data-testid="goal-progress-card">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                Financial Goal
            </h4>

            {isLoading ? (
                <p className="text-sm text-slate-400 italic text-center py-4">Loading goals…</p>
            ) : goals.length === 0 ? (
                /* DB-05: this used to instruct "set one during onboarding" while
                 * offering no control to do it — a dead end. Goals can only be
                 * created during onboarding today, so per the EmptyState contract
                 * the action is omitted and the copy stays honest
                 * rather than promising a control that does not exist. The action
                 * comes back when a goal surface ships. */
                <EmptyState
                    icon={Target}
                    title="No goal set yet"
                    description="Goals are created during onboarding. Progress here stays read-only until goals can be funded."
                    testId="goal-empty-state"
                    className="py-4"
                />
            ) : (
                <div className="space-y-4">
                    {goals.map((goal) => {
                        const percent = getGoalProgressPercent(goal);
                        return (
                            <div key={goal.id} data-testid={`goal-${goal.id}`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate">
                                            {goal.title}
                                        </p>
                                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded inline-block mt-0.5">
                                            {GOAL_TYPE_LABELS[goal.goalType] ?? 'Other'}
                                        </span>
                                    </div>
                                    <span className="font-mono font-bold text-sm tabular-nums shrink-0 text-slate-700 dark:text-slate-300">
                                        {formatCurrency(fromCents(goal.targetAmountCents), goal.currency)}
                                    </span>
                                </div>

                                <div
                                    className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                                    role="progressbar"
                                    aria-label={`${goal.title} progress`}
                                    aria-valuenow={percent}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
                                </div>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    {formatCurrencyCompact(fromCents(goal.currentAmountCents), goal.currency)} of{' '}
                                    {formatCurrencyCompact(fromCents(goal.targetAmountCents), goal.currency)} · read-only
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
