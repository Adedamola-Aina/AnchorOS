/**
 * SwipeableTransactionItem - Mobile-optimized transaction row with swipe actions
 * 
 * Wraps TransactionItem with SwipeableRow for mobile gesture support.
 * On mobile: swipe left to delete, swipe right to edit
 * On desktop: uses hover-based action buttons (no swipe)
 * 
 * @module features/finance/components/SwipeableTransactionItem
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { SwipeableRow } from '../../../components/mobile/SwipeableRow';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction } from '../../../types';
interface SwipeableTransactionItemProps {
  transaction: AnchorTransaction;
  accountName?: string;
  onEdit: (tx: AnchorTransaction) => void;
  onDelete: (tx: AnchorTransaction) => void;
  currentUserId?: string;
}
export const SwipeableTransactionItem: React.FC<SwipeableTransactionItemProps> = ({
  transaction,
  accountName,
  onEdit,
  onDelete,
  currentUserId
}) => {
  if (stryMutAct_9fa48("4590")) {
    {}
  } else {
    stryCov_9fa48("4590");
    const {
      isMobile
    } = useResponsive();

    // On mobile, wrap with SwipeableRow for gesture support
    if (stryMutAct_9fa48("4592") ? false : stryMutAct_9fa48("4591") ? true : (stryCov_9fa48("4591", "4592"), isMobile)) {
      if (stryMutAct_9fa48("4593")) {
        {}
      } else {
        stryCov_9fa48("4593");
        return <SwipeableRow onSwipeLeft={stryMutAct_9fa48("4594") ? () => undefined : (stryCov_9fa48("4594"), () => onDelete(transaction))} onSwipeRight={stryMutAct_9fa48("4595") ? () => undefined : (stryCov_9fa48("4595"), () => onEdit(transaction))} leftAction={stryMutAct_9fa48("4596") ? {} : (stryCov_9fa48("4596"), {
          label: stryMutAct_9fa48("4597") ? "" : (stryCov_9fa48("4597"), 'Edit'),
          color: stryMutAct_9fa48("4598") ? "" : (stryCov_9fa48("4598"), 'blue'),
          icon: <Pencil className="w-4 h-4 mr-1" />
        })} rightAction={stryMutAct_9fa48("4599") ? {} : (stryCov_9fa48("4599"), {
          label: stryMutAct_9fa48("4600") ? "" : (stryCov_9fa48("4600"), 'Delete'),
          color: stryMutAct_9fa48("4601") ? "" : (stryCov_9fa48("4601"), 'red'),
          icon: <Trash2 className="w-4 h-4 mr-1" />
        })}>
                <TransactionItem transaction={transaction} accountName={accountName} onEdit={onEdit} onDelete={onDelete} currentUserId={currentUserId} />
            </SwipeableRow>;
      }
    }

    // On desktop, render TransactionItem directly (uses hover-based actions)
    return <TransactionItem transaction={transaction} accountName={accountName} onEdit={onEdit} onDelete={onDelete} currentUserId={currentUserId} />;
  }
};