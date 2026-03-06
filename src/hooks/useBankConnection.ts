// @ts-nocheck
import { useState, useCallback, useMemo } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

interface LinkBankResult {
  accountId: string;
  institutionName: string;
}

interface SyncResult {
  transactionsAdded: number;
}

export const useBankConnection = () => {
  const [isLinking, setIsLinking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkBank = useCallback(async (code: string): Promise<LinkBankResult> => {
    setIsLinking(true);
    setError(null);
    try {
      const callable = httpsCallable<{ code: string }, LinkBankResult>(functions, 'linkBankAccount');
      const result = await callable({ code });
      return result.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to link bank';
      setError(msg);
      throw err;
    } finally {
      setIsLinking(false);
    }
  }, []);

  const unlinkBank = useCallback(async (accountId: string): Promise<void> => {
    setError(null);
    try {
      const callable = httpsCallable<{ accountId: string }, { success: boolean }>(functions, 'unlinkBankAccount');
      await callable({ accountId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to unlink bank';
      setError(msg);
      throw err;
    }
  }, []);

  const syncNow = useCallback(async (accountId: string): Promise<SyncResult> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError('You are offline — sync requires an internet connection');
      return { transactionsAdded: 0 };
    }
    setIsSyncing(true);
    setError(null);
    try {
      const callable = httpsCallable<{ accountId: string }, SyncResult>(functions, 'syncBankAccountNow');
      const result = await callable({ accountId });
      return result.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to sync';
      setError(msg);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return useMemo(() => ({
    isLinking, isSyncing, error,
    linkBank, unlinkBank, syncNow, clearError,
  }), [isLinking, isSyncing, error, linkBank, unlinkBank, syncNow, clearError]);
};
