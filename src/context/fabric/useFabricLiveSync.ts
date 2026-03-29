import { useEffect, useRef } from 'react';
import { collection, limit, onSnapshot, orderBy, query, where } from '../../utils/secureDb';
import type { AnchorAccount, AnchorTask, AnchorTransaction, RecurringTransaction } from '../../types';
import { db, APP_ID } from '../../config/firebase';
import type { FabricService } from '../../services/fabric/FabricService';

interface UseFabricLiveSyncArgs {
  userId: string | null;
  isEnabled: boolean;
  fabricService: FabricService;
  refresh: () => void;
}

export function useFabricLiveSync({ userId, isEnabled, fabricService, refresh }: UseFabricLiveSyncArgs): void {
  const liveTransactions = useRef<AnchorTransaction[]>([]);
  const liveCommitments = useRef<AnchorTask[]>([]);
  const liveAccounts = useRef<AnchorAccount[]>([]);
  const liveRecurring = useRef<RecurringTransaction[]>([]);

  useEffect(() => {
    if (!userId || !isEnabled) return;

    const push = () => {
      fabricService.updateActivity(
        liveTransactions.current,
        liveCommitments.current,
        liveAccounts.current,
        liveRecurring.current,
      );
      refresh();
    };

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const unsubFinance = onSnapshot(
      query(
        collection(db, 'artifacts', APP_ID, 'users', userId, 'finance'),
        where('date', '>=', oneYearAgo.toISOString()),
        orderBy('date', 'desc'),
        limit(500),
      ),
      (snap) => {
        liveTransactions.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnchorTransaction));
        push();
      },
    );

    const unsubCommitments = onSnapshot(
      collection(db, 'artifacts', APP_ID, 'users', userId, 'commitments'),
      (snap) => {
        liveCommitments.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnchorTask));
        push();
      },
    );

    const unsubAccounts = onSnapshot(
      query(collection(db, 'artifacts', APP_ID, 'users', userId, 'accounts'), limit(50)),
      (snap) => {
        liveAccounts.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnchorAccount));
        push();
      },
    );

    const unsubRecurring = onSnapshot(
      query(collection(db, 'artifacts', APP_ID, 'recurring_transactions'), where('userId', '==', userId)),
      (snap) => {
        liveRecurring.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringTransaction));
        push();
      },
    );

    return () => {
      unsubFinance();
      unsubCommitments();
      unsubAccounts();
      unsubRecurring();
    };
  }, [fabricService, isEnabled, refresh, userId]);
}
