/**
 * RecurringOptions - Toggle and settings for recurring transactions
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import type { RecurringFrequency } from '../../../types';
import { Text, HStack, VStack } from '../../../components/primitives';

interface RecurringOptionsProps {
    isRecurring: boolean;
    onChange: (isRecurring: boolean) => void;
    frequency: RecurringFrequency;
    onFrequencyChange: (f: RecurringFrequency) => void;
    interval: number;
    onIntervalChange: (i: number) => void;
}

export const RecurringOptions: React.FC<RecurringOptionsProps> = ({
    isRecurring, onChange, frequency, onFrequencyChange, interval, onIntervalChange
}) => {
    return (
        <div className="bg-surface-3 dark:bg-surface-3-dark p-3 rounded-lg border border-[var(--border)]">
            <HStack justify="between" align="center" className="mb-2">
                <Text variant="body" size="sm" weight="medium">
                    Make Recurring?
                </Text>
                <div
                    onClick={() => onChange(!isRecurring)}
                    className={`
                        w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors
                        ${isRecurring ? 'bg-primary-600' : 'bg-surface-hover dark:bg-surface-hover-dark'}
                    `}
                >
                    <div className={`
                        bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
                        ${isRecurring ? 'translate-x-5' : 'translate-x-0'}
                    `} />
                </div>
            </HStack>

            {isRecurring && (
                <div className="grid grid-cols-2 gap-3 mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                    <VStack gap="xs">
                        <Text variant="muted" size="xs" weight="medium">
                            Frequency
                        </Text>
                        <select
                            value={frequency}
                            onChange={(e) => onFrequencyChange(e.target.value as RecurringFrequency)}
                            className="w-full text-sm rounded-lg border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </VStack>
                    <VStack gap="xs">
                        <Text variant="muted" size="xs" weight="medium">
                            Every...
                        </Text>
                        <HStack gap="sm" align="center">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={interval}
                                onChange={(e) => onIntervalChange(parseInt(e.target.value) || 1)}
                                className="w-full text-sm rounded-lg border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark"
                            />
                            <Text variant="muted" size="xs">
                                {frequency === 'weekly' && 'week(s)'}
                                {frequency === 'monthly' && 'month(s)'}
                                {frequency === 'yearly' && 'year(s)'}
                            </Text>
                        </HStack>
                    </VStack>
                </div>
            )}
        </div>
    );
};

