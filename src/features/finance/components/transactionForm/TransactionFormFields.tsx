/**
 * TransactionForm Field Components
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


import React from 'react';
import { toCents, fromCents } from '../../../../utils/moneyUtils';
import { InlineDatePicker } from '../../../../components/shared';

interface DescriptionFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onClearError: () => void;
    disabled?: boolean;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ value, onChange, error, onClearError, disabled }) => (
    <div>
        <label htmlFor="tx-title" className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-1">
            Description {error && <span className="text-rose-500 ml-2 normal-case font-normal">{error}</span>}
        </label>
        <input
            id="tx-title"
            type="text"
            placeholder="e.g. Groceries, Upwork Salary"
            className={`w-full p-3 min-h-[44px] rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors ${error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            value={value}
            onChange={(e) => { onChange(e.target.value); if (error) onClearError(); }}
            disabled={disabled}
        />
    </div>
);

interface AmountFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onClearError: () => void;
    currency?: string;
    disabled?: boolean;
}

/**
 * AmountField — the composer's hero.
 *
 * UX-FN-18: amount-first. The amount is the one thing the user always knows and
 * the one thing the whole flow is about, so it is rendered large, tabular and
 * first, with the account's currency beside it. The visible label is gone (the
 * number and the currency say what this is); a visually hidden label keeps the
 * field's accessible name "Amount" for screen readers and tests.
 */
export const AmountField: React.FC<AmountFieldProps> = ({ value, onChange, error, onClearError, currency, disabled }) => (
    <div>
        <label htmlFor="tx-amount" className="sr-only">Amount</label>
        <div className="group flex items-center gap-2">
            <input
                id="tx-amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                aria-invalid={error ? 'true' : undefined}
                aria-errormessage={error ? 'tx-amount-error' : undefined}
                className={`amount-hero min-w-0 flex-1 bg-transparent py-1 text-[34px] font-bold leading-tight tabular-nums text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                value={value}
                onChange={(e) => { if (/^[0-9.,]*$/.test(e.target.value)) { onChange(e.target.value); if (error) onClearError(); } }}
                onBlur={() => { if (value) onChange(fromCents(toCents(value)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }}
                onFocus={() => { if (value) onChange(value.replace(/,/g, '')); }}
                disabled={disabled}
                autoFocus
            />
            {currency && (
                <span className="shrink-0 text-lg font-semibold text-slate-400 dark:text-slate-500">{currency}</span>
            )}
        </div>
        {/* Focus indicator: the underline, not a ring around the whole field. */}
        <div className={`h-px transition-colors ${error ? 'bg-rose-400' : 'bg-slate-200 dark:bg-slate-700 group-focus-within:bg-primary-500 dark:group-focus-within:bg-primary-400'}`} />
        {error && (
            <p id="tx-amount-error" className="mt-1 text-xs font-medium text-rose-500">{error}</p>
        )}
    </div>
);

interface DateFieldProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({ value, onChange, disabled }) => (
    <div>
        <InlineDatePicker
            label="Date"
            value={value}
            onChange={onChange}
            disabled={disabled}
            testId="tx-date"
        />
    </div>
);
