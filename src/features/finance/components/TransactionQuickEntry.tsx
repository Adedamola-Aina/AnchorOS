import React, { useState, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { parseTransaction } from '../../../services/fabric/transactionParser';
import type { ParsedTransaction } from '../../../services/fabric/transactionParser';

interface TransactionQuickEntryProps {
  onParsed: (data: ParsedTransaction) => void;
}

export const TransactionQuickEntry: React.FC<TransactionQuickEntryProps> = ({ onParsed }) => {
  const [input, setInput] = useState('');

  const preview = useMemo(() => {
    if (!input.trim()) return null;
    return parseTransaction(input);
  }, [input]);

  const hasPreview = preview && (preview.amount || preview.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const parsed = parseTransaction(input);
    onParsed(parsed);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 focus-within:ring-2 focus-within:ring-slate-400 dark:focus-within:ring-slate-500 transition-all">
        <Zap className="w-4 h-4 text-amber-500 shrink-0" />
        <input
          data-testid="quick-entry-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "Spent ₦2500 on groceries yesterday"'
          className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-h-[44px]"
          autoComplete="off"
        />
      </div>

      {hasPreview && (
        <div
          data-testid="quick-entry-preview"
          className="mt-1 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap"
        >
          {preview.amount !== undefined && (
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
              {preview.amount.toLocaleString()}
            </span>
          )}
          {preview.category && (
            <span className="bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
              {preview.category}
            </span>
          )}
          {preview.date && (
            <span className="text-slate-400">{preview.date}</span>
          )}
        </div>
      )}
    </form>
  );
};
