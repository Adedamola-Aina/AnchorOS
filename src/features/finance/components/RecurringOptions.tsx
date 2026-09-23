
import React from 'react';
import type { RecurringFrequency } from '../../../types';
import { SegmentedControl, ToggleSwitch } from '../../../components/shared';

interface RecurringOptionsProps {
    isRecurring: boolean;
    onChange: (isRecurring: boolean) => void;
    frequency: RecurringFrequency;
    onFrequencyChange: (f: RecurringFrequency) => void;
    interval: number;
    onIntervalChange: (i: number) => void;
}

/**
 * RecurringOptions — "Off >" until it is on.
 *
 * UX-FN-21: this was a bordered box wrapping a hand-rolled toggle `div` (not a
 * button, not a switch, no keyboard support, no accessible state). It now uses
 * the app's shared `ToggleSwitch` (`role="switch"`, `aria-checked`, 44px target)
 * and stays a single row until the user turns it on — progressive disclosure:
 * the cadence controls only exist once they mean something.
 */
export const RecurringOptions: React.FC<RecurringOptionsProps> = ({
    isRecurring, onChange, frequency, onFrequencyChange, interval, onIntervalChange
}) => (
    <div>
        <div className="flex items-center justify-between gap-3 min-h-[44px]">
            <label
                htmlFor="tx-recurring-toggle"
                className="text-[15px] font-medium text-slate-700 dark:text-slate-200"
            >
                Recurring
            </label>
            <span id="tx-recurring-toggle">
                <ToggleSwitch
                    enabled={isRecurring}
                    onToggle={() => onChange(!isRecurring)}
                    label="Make this transaction recurring"
                    activeColor="bg-slate-900 dark:bg-white"
                />
            </span>
        </div>

        {isRecurring && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                <SegmentedControl
                    label="Repeats"
                    options={[
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'yearly', label: 'Yearly' },
                    ]}
                    value={frequency}
                    onChange={(v) => onFrequencyChange(v as RecurringFrequency)}
                    testId="recurring-frequency"
                />
                <div>
                    <label htmlFor="tx-recurring-interval" className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-1">
                        Every
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="tx-recurring-interval"
                            type="number"
                            min="1"
                            max="12"
                            value={interval}
                            onChange={(e) => onIntervalChange(parseInt(e.target.value) || 1)}
                            className="w-20 min-h-[44px] rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white px-3"
                        />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {frequency === 'weekly' && (interval === 1 ? 'week' : 'weeks')}
                            {frequency === 'monthly' && (interval === 1 ? 'month' : 'months')}
                            {frequency === 'yearly' && (interval === 1 ? 'year' : 'years')}
                        </span>
                    </div>
                </div>
            </div>
        )}
    </div>
);
