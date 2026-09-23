
/**
 * useAccountTransactions — transaction computation logic for AccountDetailsView.
 * Extracted per ARCH-001 (200-line rule).
 */

import { useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../../types';
import { getWeeklySpending } from '../../../utils/financeInsights';
import { isTransferLeg } from '../../../utils/financeInsights';
import { useTransactionsQuery } from '../../../hooks/queries/useFinanceQueries';

const CARRYOVER_DAYS = 14;

export function useAccountTransactions(
  account: AnchorAccount,
  currentMonth: Date,
  transactions: AnchorTransaction[],
  userId: string | undefined,
  filters: { searchQuery: string; filterType: string; selectedWeekStart: Date | null },
) {
  const { carryoverStart, carryoverEnd } = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const trailEnd = new Date(monthStart.getTime() - 1);
    const trailStart = new Date(monthStart);
    trailStart.setDate(trailStart.getDate() - CARRYOVER_DAYS);
    return { carryoverStart: trailStart.toISOString(), carryoverEnd: trailEnd.toISOString() };
  }, [currentMonth]);

  const { data: carryoverTx = [] } = useTransactionsQuery(userId, carryoverStart, carryoverEnd);
  const currentMonthTx = useMemo(() => (transactions || []).filter(t => t?.accountId === account.id), [transactions, account.id]);
  const carryoverAccountTx = useMemo(() => (carryoverTx || []).filter(t => t?.accountId === account.id), [carryoverTx, account.id]);

  const accountTransactions = useMemo(() => {
    const ids = new Set(currentMonthTx.map(t => t.id));
    const trailing = carryoverAccountTx.filter(t => !ids.has(t.id));
    return [...currentMonthTx, ...trailing];
  }, [currentMonthTx, carryoverAccountTx]);

  const weeklyData = useMemo(() => getWeeklySpending(accountTransactions, currentMonth), [accountTransactions, currentMonth]);
  const maxWeeklyAmount = useMemo(() => Math.max(...weeklyData.flatMap(d => [d.income, d.expense]), 1), [weeklyData]);

  /**
   * Transfers (spec §10): the ledger stores an internal transfer as an *expense*
   * leg on the source account and an *income* leg on the destination account,
   * both with `category: 'Transfer'` and a shared `linkId` (see
   * `services/TransferOperations.ts`). At ACCOUNT level that is financially
   * correct — the money really did leave / arrive — but the account summary must
   * say when a transfer is inside the number, or "In/Out" reads as economic
   * income and spending. Detecting the legs here (never rewriting the ledger)
   * lets the summary disclose it.
   */
  const transferLegCount = useMemo(
    () => accountTransactions.filter(t => t && !t.isSoftDeleted && isTransferLeg(t)).length,
    [accountTransactions],
  );

  const monthlyBalance = useMemo(() => {
    const now = new Date();
    const isCurrentMonth = currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear();
    let monthIncome = 0;
    let monthExpense = 0;
    accountTransactions.forEach(t => {
      if (!t || t.isSoftDeleted) return;
      const amount = t.amountCents || 0;
      if (t.type === 'income') monthIncome += amount;
      else if (t.type === 'expense') monthExpense += amount;
      else if (t.type === 'transfer') {
        if (t.accountId === account.id) monthExpense += amount;
        else monthIncome += amount;
      }
    });
    const netChange = monthIncome - monthExpense;
    const closingBalance = isCurrentMonth ? account.balanceCents : undefined;
    const openingBalance = isCurrentMonth ? account.balanceCents - netChange : undefined;
    return { openingBalance, closingBalance, monthIncome, monthExpense, netChange, isCurrentMonth };
  }, [accountTransactions, account.balanceCents, account.id, currentMonth]);

  const { filteredList, carryoverDividerIndex } = useMemo(() => {
    const { searchQuery, filterType, selectedWeekStart } = filters;
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const sorted = accountTransactions.filter(t => {
      if (!t) return false;
      /**
       * Scope semantics (UX-FN-15). A transfer leg is stored as income/expense,
       * so "Money in / Money out" must exclude it or the filter would silently
       * answer a different question than its label ("Transfers" is its own
       * scope). `all` shows everything.
       */
      const transfer = isTransferLeg(t);
      if (filterType === 'transfer') {
        if (!transfer) return false;
      } else if (filterType !== 'all') {
        if (transfer || t.type !== filterType) return false;
      }
      if (selectedWeekStart && t.date) {
        const d = new Date(t.date);
        const end = new Date(selectedWeekStart);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        if (d < selectedWeekStart || d > end) return false;
      }
      if (!searchQuery) return true;
      return (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const divider = sorted.findIndex(t => new Date(t.transactionDate || t.date) < monthStart);
    return { filteredList: sorted, carryoverDividerIndex: divider >= 0 ? divider : undefined };
  }, [accountTransactions, filters, currentMonth]);

  return { accountTransactions, weeklyData, maxWeeklyAmount, monthlyBalance, filteredList, carryoverDividerIndex, transferLegCount };
}
