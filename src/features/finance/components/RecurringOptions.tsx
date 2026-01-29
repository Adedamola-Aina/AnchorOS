import React from 'react';
import type { RecurringFrequency } from '../../../types';

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
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Make Recurring?
                </label>
                <div
                    onClick={() => onChange(!isRecurring)}
                    className={`
                        w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors
                        ${isRecurring ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}
                    `}
                >
                    <div className={`
                        bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
                        ${isRecurring ? 'translate-x-5' : 'translate-x-0'}
                    `} />
                </div>
            </div>

            {isRecurring && (
                <div className="grid grid-cols-2 gap-3 mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => onFrequencyChange(e.target.value as RecurringFrequency)}
                            className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Every...
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={interval}
                                onChange={(e) => onIntervalChange(parseInt(e.target.value) || 1)}
                                className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {frequency === 'weekly' && 'week(s)'}
                                {frequency === 'monthly' && 'month(s)'}
                                {frequency === 'yearly' && 'year(s)'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
