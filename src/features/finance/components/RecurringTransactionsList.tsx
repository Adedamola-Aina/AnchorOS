/**
 * RecurringTransactionsList
 * 
 * Displays a list of active and paused recurring transaction rules.
 * Allows users to pause, resume, or delete rules.
 */

import React from 'react';
import { format } from 'date-fns';
import { CalendarClock, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { useRecurringTransactions, useUpdateRecurringTransaction, useDeleteRecurringTransaction } from '../../../hooks/useRecurringQueries';
import { useAuth } from '../../../context/AuthContext';
import { useHaptic } from '../../../hooks/useHaptic';
import { fromCents } from '../../../utils/moneyUtils';
import type { RecurringTransaction } from '../../../types';

export const RecurringTransactionsList: React.FC = () => {
    const { user } = useAuth();
    const haptic = useHaptic();
    const { data: rules, isLoading, isEmpty } = useRecurringTransactions(user?.uid);
    const { mutateAsync: updateRule } = useUpdateRecurringTransaction();
    const { mutateAsync: deleteRule } = useDeleteRecurringTransaction();

    const handleToggleStatus = async (rule: RecurringTransaction) => {
        haptic.trigger('medium');
        const newStatus = rule.status === 'active' ? 'paused' : 'active';
        await updateRule({ id: rule.id, updates: { status: newStatus } });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this recurring rule?')) {
            haptic.trigger('heavy');
            await deleteRule(id);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                <CalendarClock className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">No recurring rules set up yet.</p>
                <p className="text-xs text-center mt-1 max-w-xs">
                    Toggle "Make Recurring" when adding a transaction to automate your bills.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {rules.map(rule => (
                <div
                    key={rule.id}
                    className={`
                        relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl border transition-colors
                        ${rule.status === 'paused' ? 'border-amber-200 dark:border-amber-900/30 opacity-75' : 'border-slate-100 dark:border-slate-700'}
                    `}
                >
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                ${rule.status === 'paused' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'}
                            `}>
                                <CalendarClock className="w-5 h-5" />
                            </div>

                            <div>
                                <h4 className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                                    {rule.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="capitalize">{rule.frequency}</span>
                                    <span>•</span>
                                    <span>Next: {format(new Date(rule.nextRunAt), 'MMM d, yyyy')}</span>
                                    {rule.status === 'paused' && (
                                        <span className="text-amber-600 dark:text-amber-500 font-medium bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                                            Paused
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className={`
                                font-bold font-mono
                                ${rule.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}
                            `}>
                                {rule.type === 'income' ? '+' : ''}
                                {fromCents(rule.amountCents).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}
                            </span>

                            <div className="flex items-center gap-1 mt-1">
                                <button
                                    onClick={() => handleToggleStatus(rule)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                    title={rule.status === 'active' ? "Pause Rule" : "Resume Rule"}
                                >
                                    {rule.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => handleDelete(rule.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                    title="Delete Rule"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
