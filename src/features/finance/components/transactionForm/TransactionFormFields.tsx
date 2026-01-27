/**
 * TransactionForm Field Components
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Calendar } from 'lucide-react';
import { toCents, fromCents } from '../../../../utils/moneyUtils';
import type { AnchorAccount } from '../../../../types';

interface DescriptionFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onClearError: () => void;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ value, onChange, error, onClearError }) => (
    <div>
        <label htmlFor="tx-title" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Description {error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
        </label>
        <input
            id="tx-title"
            type="text"
            placeholder="e.g. Groceries, Upwork Salary"
            className={`w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 transition-colors ${error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
            value={value}
            onChange={(e) => { onChange(e.target.value); if (error) onClearError(); }}
            autoFocus
        />
    </div>
);

interface AmountFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onClearError: () => void;
    currency?: string;
}

export const AmountField: React.FC<AmountFieldProps> = ({ value, onChange, error, onClearError, currency }) => (
    <div>
        <label htmlFor="tx-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Amount {error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
        </label>
        <div className="relative">
            <input
                id="tx-amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className={`w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold placeholder:text-slate-500 transition-all ${error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
                value={value}
                onChange={(e) => { if (/^[0-9.,]*$/.test(e.target.value)) { onChange(e.target.value); if (error) onClearError(); } }}
                onBlur={() => { if (value) onChange(fromCents(toCents(value)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }}
                onFocus={() => { if (value) onChange(value.replace(/,/g, '')); }}
            />
            {currency && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{currency}</span>}
        </div>
    </div>
);

interface DateFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export const DateField: React.FC<DateFieldProps> = ({ value, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Date</label>
        <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
            />
        </div>
    </div>
);
