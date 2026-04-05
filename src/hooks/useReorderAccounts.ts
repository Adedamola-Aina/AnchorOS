/**
 * useReorderAccounts — Persist account sort order to Firestore.
 * UX-041 Phase 2 §5.7. Uses batch write through secureDb.
 */
import { useCallback, useRef } from 'react';
import { writeBatch, doc, db } from '../utils/secureDb';
import { useAuth } from '../context/AuthContext';
import type { AnchorAccount } from '../types';

export function useReorderAccounts() {
  const { user } = useAuth();
  const pendingRef = useRef(false);

  const reorder = useCallback(async (accounts: AnchorAccount[]) => {
    if (!user?.uid || pendingRef.current) return;
    pendingRef.current = true;
    try {
      const batch = writeBatch(db);
      accounts.forEach((acc, i) => {
        const ref = doc(db, 'users', user.uid, 'accounts', acc.id);
        batch.update(ref, { sortOrder: i });
      });
      await batch.commit();
    } finally {
      pendingRef.current = false;
    }
  }, [user?.uid]);

  return { reorder };
}
