/**
 * Edit Task Form - Type-Specific Field Components
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Button } from '@anchor-os/ui';
import type { TimeOfDay } from '../../../types';
import { Text, VStack, HStack } from '../../../components/primitives';

interface DailyFieldsProps {
    editTime: TimeOfDay;
    setEditTime: (time: TimeOfDay) => void;
}

export const DailyFields: React.FC<DailyFieldsProps> = ({ editTime, setEditTime }) => (
    <VStack gap="xs">
        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Time of Day</Text>
        <div className="grid grid-cols-4 gap-2">
            {(['morning', 'afternoon', 'evening', 'any'] as TimeOfDay[]).map((t) => (
                <Button
                    key={t}
                    type="button"
                    onClick={() => setEditTime(t)}
                    variant={editTime === t ? 'secondary' : 'ghost'}
                    className={`px-0 text-[10px] capitalize h-9 ${editTime === t ? 'bg-task-50 text-task-600 border-task-200 dark:bg-task-900/20 dark:border-task-800' : ''}`}
                >
                    {t}
                </Button>
            ))}
        </div>
    </VStack>
);

interface WeeklyFieldsProps {
    editDays: string[];
    setEditDays: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WeeklyFields: React.FC<WeeklyFieldsProps> = ({ editDays, setEditDays }) => (
    <VStack gap="xs">
        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Days</Text>
        <HStack gap="xs" className="flex-wrap">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <Button
                    key={day}
                    type="button"
                    onClick={() => setEditDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                    variant={editDays.includes(day) ? 'primary' : 'secondary'}
                    className={`h-8 px-3 text-[10px] ${editDays.includes(day) ? 'bg-task-600' : ''}`}
                >
                    {day.slice(0, 3)}
                </Button>
            ))}
        </HStack>
    </VStack>
);

interface MonthlyFieldsProps {
    editDaysOfMonth: number[];
    setEditDaysOfMonth: React.Dispatch<React.SetStateAction<number[]>>;
}

export const MonthlyFields: React.FC<MonthlyFieldsProps> = ({ editDaysOfMonth, setEditDaysOfMonth }) => (
    <VStack gap="xs">
        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Day(s) of Month</Text>
        <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button
                    key={d}
                    type="button"
                    onClick={() => {
                        setEditDaysOfMonth(prev =>
                            prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d]
                        );
                    }}
                    className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${editDaysOfMonth.includes(d)
                        ? 'bg-task-600 text-white border-transparent shadow-md'
                        : 'bg-surface-2 dark:bg-surface-2-dark text-muted border-[var(--border)] hover:border-task-300'
                        }`}
                >
                    {d}
                </button>
            ))}
        </div>
    </VStack>
);

