/**
 * RecurringTransactionsList - Active and paused recurring rules
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { format } from 'date-fns';
import { CalendarClock, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { useRecurringTransactions, useUpdateRecurringTransaction, useDeleteRecurringTransaction } from '../../../hooks/useRecurringQueries';
import { useAuth } from '../../../context/AuthContext';
import { useHaptic } from '../../../hooks/useHaptic';
import { fromCents } from '../../../utils/moneyUtils';
import type { RecurringTransaction } from '../../../types';
import { Text, VStack, HStack, Badge, Skeleton } from '../../../components/primitives';

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
            <VStack gap="sm">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rect" width="100%" height={80} className="rounded-xl" />
                ))}
            </VStack>
        );
    }

    if (isEmpty) {
        return (
            <VStack align="center" justify="center" gap="sm" className="py-12">
                <CalendarClock className="w-12 h-12 text-muted opacity-50" />
                <Text variant="muted" size="sm" weight="medium">No recurring rules set up yet.</Text>
                <Text variant="subtle" size="xs" className="text-center max-w-xs">
                    Toggle "Make Recurring" when adding a transaction to automate your bills.
                </Text>
            </VStack>
        );
    }

    return (
        <VStack gap="sm">
            {rules.map(rule => (
                <div
                    key={rule.id}
                    className={`
                        relative overflow-hidden bg-surface-2 dark:bg-surface-2-dark rounded-xl border transition-colors
                        ${rule.status === 'paused' ? 'border-warning/30 dark:border-warning-dark/30 opacity-75' : 'border-[var(--border)]'}
                    `}
                >
                    <HStack justify="between" align="center" className="p-4">
                        <HStack gap="md" align="center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                ${rule.status === 'paused' ? 'bg-warning-bg text-warning dark:bg-warning-bgDark dark:text-warning-dark' : 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'}
                            `}>
                                <CalendarClock className="w-5 h-5" />
                            </div>

                            <VStack gap="none">
                                <Text variant="heading" size="sm" weight="medium">
                                    {rule.title}
                                </Text>
                                <HStack gap="sm" align="center">
                                    <Text variant="muted" size="xs" className="capitalize">{rule.frequency}</Text>
                                    <Text variant="muted" size="xs">•</Text>
                                    <Text variant="muted" size="xs">Next: {format(new Date(rule.nextRunAt), 'MMM d, yyyy')}</Text>
                                    {rule.status === 'paused' && (
                                        <Badge variant="warning" size="xs">Paused</Badge>
                                    )}
                                </HStack>
                            </VStack>
                        </HStack>

                        <VStack gap="xs" align="end">
                            <Text
                                variant={rule.type === 'income' ? 'finance' : 'heading'}
                                weight="bold"
                                mono
                            >
                                {rule.type === 'income' ? '+' : ''}
                                {fromCents(rule.amountCents).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}
                            </Text>

                            <HStack gap="xs">
                                <button
                                    onClick={() => handleToggleStatus(rule)}
                                    className="p-1.5 text-muted hover:text-primary-600 dark:hover:text-primary-400"
                                    title={rule.status === 'active' ? "Pause Rule" : "Resume Rule"}
                                >
                                    {rule.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => handleDelete(rule.id)}
                                    className="p-1.5 text-muted hover:text-danger dark:hover:text-danger-dark"
                                    title="Delete Rule"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </HStack>
                        </VStack>
                    </HStack>
                </div>
            ))}
        </VStack>
    );
};

