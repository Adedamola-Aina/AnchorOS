/**
 * TaskForm Wizard Steps & Field Components
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { X, Sunrise, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import type { TaskType, TimeOfDay } from '../../../types';
import { Text, VStack, HStack } from '../../../components/primitives';

interface FrequencyStepProps { onSelectType: (type: TaskType) => void; onClose: () => void; }
export const FrequencyStep: React.FC<FrequencyStepProps> = ({ onSelectType, onClose }) => {
    const options = [
        { id: 'todo', label: 'Todo', desc: 'One-time task', icon: <CheckCircle2 className="w-6 h-6 text-finance-500" /> },
        { id: 'daily', label: 'Daily', desc: 'Every single day', icon: <Sunrise className="w-6 h-6 text-task-500" /> },
        { id: 'weekly', label: 'Weekly', desc: 'On specific days', icon: <Calendar className="w-6 h-6 text-task-600" /> },
        { id: 'monthly', label: 'Monthly', desc: 'On a specific date', icon: <CheckCircle2 className="w-6 h-6 text-task-500" /> },
    ];
    return (
        <VStack gap="lg">
            <HStack justify="between" align="center">
                <Text variant="heading" size="lg">Choose Frequency</Text>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-muted"><X className="w-5 h-5" /></Button>
            </HStack>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((option) => (
                    <button key={option.id} onClick={() => onSelectType(option.id as TaskType)} className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-[var(--border-subtle)] bg-surface-3/50 dark:bg-surface-3-dark/50 hover:border-task-500/50 hover:bg-task-50/50 dark:hover:bg-task-900/10 transition-all text-center group">
                        <div className="p-3 bg-surface-2 dark:bg-surface-2-dark rounded-2xl shadow-sm border border-[var(--border-subtle)] group-hover:scale-110 transition-transform">{option.icon}</div>
                        <VStack gap="none" align="center">
                            <Text variant="heading" size="sm">{option.label}</Text>
                            <Text variant="muted" size="xs">{option.desc}</Text>
                        </VStack>
                    </button>
                ))}
            </div>
        </VStack>
    );
};

interface DetailsHeaderProps { taskType: TaskType; onBack: () => void; onClose: () => void; }
export const DetailsHeader: React.FC<DetailsHeaderProps> = ({ taskType, onBack, onClose }) => (
    <HStack justify="between" align="center">
        <HStack gap="sm" align="center">
            <Button type="button" variant="ghost" size="icon" onClick={onBack} className="text-muted"><ChevronDown className="w-5 h-5 rotate-90" /></Button>
            <Text variant="heading" size="lg" className="capitalize">{taskType} Commitment</Text>
        </HStack>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted"><X className="w-5 h-5" /></Button>
    </HStack>
);

interface DailyTimeFieldProps { value: TimeOfDay; onChange: (v: TimeOfDay) => void; }
export const DailyTimeField: React.FC<DailyTimeFieldProps> = ({ value, onChange }) => (
    <VStack gap="xs">
        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Preferred Time</Text>
        <div className="grid grid-cols-2 gap-2">
            {['morning', 'afternoon', 'evening', 'any'].map((t) => (
                <Button key={t} type="button" onClick={() => onChange(t as TimeOfDay)} variant={value === t ? 'secondary' : 'ghost'}
                    className={`p-2.5 capitalize ${value === t ? 'bg-task-50 text-task-600 border-task-200 dark:bg-task-900/20 dark:border-task-800' : ''}`}>{t}</Button>
            ))}
        </div>
    </VStack>
);

interface WeeklyDaysFieldProps { value: string[]; onChange: (days: string[]) => void; }
export const WeeklyDaysField: React.FC<WeeklyDaysFieldProps> = ({ value, onChange }) => (
    <VStack gap="xs">
        <Text variant="subtle" size="xs" weight="bold" className="uppercase">On which days?</Text>
        <HStack justify="between" gap="xs">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                <button key={d} type="button" onClick={() => onChange(value.includes(d) ? value.filter(day => day !== d) : [...value, d])}
                    className={`w-10 h-10 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${value.includes(d) ? 'bg-task-600 text-white border-transparent' : 'bg-surface-2 dark:bg-surface-2-dark text-muted border-[var(--border)] hover:border-task-300'}`}>{d[0]}</button>
            ))}
        </HStack>
    </VStack>
);

interface MonthlyDatesFieldProps { value: number[]; onChange: (dates: number[]) => void; }
export const MonthlyDatesField: React.FC<MonthlyDatesFieldProps> = ({ value, onChange }) => (
    <VStack gap="xs">
        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Which date(s)?</Text>
        <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button key={d} type="button" onClick={() => onChange(value.includes(d) ? value.filter(day => day !== d) : [...value, d])}
                    className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${value.includes(d) ? 'bg-task-600 text-white border-transparent' : 'bg-surface-2 dark:bg-surface-2-dark text-muted border-[var(--border)] hover:border-task-300'}`}>{d}</button>
            ))}
        </div>
    </VStack>
);

