/**
 * TransactionForm Field Components
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Calendar } from 'lucide-react';
import { toCents, fromCents } from '../../../../utils/moneyUtils';

interface DescriptionFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onClearError: () => void;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ value, onChange, error, onClearError }) => (
    <div>
        <label htmlFor="tx-title" className="block text-xs font-bold text-muted uppercase mb-1">
            Description {error && <span className="text-danger-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
        </label>
        <input
            id="tx-title"
            type="text"
            placeholder="e.g. Groceries, Upwork Salary"
            className={`w-full p-3 rounded-lg border bg-surface-2 dark:bg-surface-1-dark text-foreground dark:text-foreground-dark placeholder:text-muted transition-colors ${error ? 'border-danger-500 ring-1 ring-danger-500' : 'border-border-subtle dark:border-border-dark'}`}
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
        <label htmlFor="tx-amount" className="block text-xs font-bold text-muted uppercase mb-1">
            Amount {error && <span className="text-danger-500 ml-2 normal-case font-normal animate-pulse">{error}</span>}
        </label>
        <div className="relative">
            <input
                id="tx-amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className={`w-full p-3 rounded-lg border bg-surface-2 dark:bg-surface-1-dark text-foreground dark:text-foreground-dark font-bold placeholder:text-muted transition-all ${error ? 'border-danger-500 ring-1 ring-danger-500' : 'border-border-subtle dark:border-border-dark'}`}
                value={value}
                onChange={(e) => { if (/^[0-9.,]*$/.test(e.target.value)) { onChange(e.target.value); if (error) onClearError(); } }}
                onBlur={() => { if (value) onChange(fromCents(toCents(value)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }}
                onFocus={() => { if (value) onChange(value.replace(/,/g, '')); }}
            />
            {currency && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">{currency}</span>}
        </div>
    </div>
);

interface DateFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export const DateField: React.FC<DateFieldProps> = ({ value, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-muted uppercase mb-1">Date</label>
        <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted" />
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-border-subtle dark:border-border-dark text-sm bg-surface-1 dark:bg-surface-1-dark text-foreground dark:text-foreground-dark [color-scheme:light] dark:[color-scheme:dark]"
            />
        </div>
    </div>
);
