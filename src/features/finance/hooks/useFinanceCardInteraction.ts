// @ts-nocheck
/** Card stack interaction logic — extracted per ARCH-001 (200-line rule). */

import { useState, useCallback } from 'react';
import type { AnchorAccount } from '../../../types';
import { logProductEvent } from '../../../services/telemetry';
import { haptic } from '../../../utils/haptic';
import { type ViewMode, VIEW_MODE_KEY, getStoredViewMode } from '../financeViewHelpers';

export function useFinanceCardInteraction(
  activeAccounts: AnchorAccount[],
  reorder: (accounts: AnchorAccount[]) => Promise<void>,
  openAccountDetails: (accountId: string) => void,
) {
  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);

  const toggleView = useCallback(() => {
    const next: ViewMode = viewMode === 'collapsed' ? 'expanded' : 'collapsed';
    setViewMode(next);
    if (next === 'expanded') haptic.selection();
    try { localStorage.setItem(VIEW_MODE_KEY, next); } catch { /* noop */ }
    logProductEvent('finance_view_mode_toggled', { mode: next });
  }, [viewMode]);

  const handleReorder = useCallback(async (reorderedAccounts: AnchorAccount[]) => {
    const movedAccount = reorderedAccounts.find((account, index) => activeAccounts[index]?.id !== account.id);
    if (movedAccount) {
      const fromIndex = activeAccounts.findIndex(account => account.id === movedAccount.id);
      const toIndex = reorderedAccounts.findIndex(account => account.id === movedAccount.id);
      if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
        logProductEvent('finance_card_reordered', { accountId: movedAccount.id, fromIndex, toIndex });
      }
    }
    await reorder(reorderedAccounts);
  }, [activeAccounts, reorder]);

  const handleCardTap = useCallback((account: AnchorAccount, _index: number, _cardEl: HTMLElement) => {
    logProductEvent('finance_card_tapped', { accountId: account.id, viewMode });
    openAccountDetails(account.id);
  }, [openAccountDetails, viewMode]);

  return { viewMode, toggleView, handleReorder, handleCardTap };
}
