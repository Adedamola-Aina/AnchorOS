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
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { SwipeableTransactionItem } from './SwipeableTransactionItem';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction } from '../../../types';
interface VirtualTransactionListProps {
  transactions: AnchorTransaction[];
  currentUserId?: string;
  onEdit: (tx: AnchorTransaction) => void;
  onDelete: (tx: AnchorTransaction) => void;
  loading?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}
export const VirtualTransactionList: React.FC<VirtualTransactionListProps> = ({
  transactions,
  currentUserId,
  onEdit,
  onDelete,
  loading,
  searchQuery,
  onClearSearch
}) => {
  if (stryMutAct_9fa48("4777")) {
    {}
  } else {
    stryCov_9fa48("4777");
    const parentRef = useRef<HTMLDivElement>(null);
    const {
      isMobile
    } = useResponsive();
    const parentVirtualizer = useVirtualizer(stryMutAct_9fa48("4778") ? {} : (stryCov_9fa48("4778"), {
      count: transactions.length,
      getScrollElement: stryMutAct_9fa48("4779") ? () => undefined : (stryCov_9fa48("4779"), () => parentRef.current),
      estimateSize: stryMutAct_9fa48("4780") ? () => undefined : (stryCov_9fa48("4780"), () => 88),
      // Row height: ~80px card + 8px gap
      overscan: 5
    }));
    const rowVirtualizer = parentVirtualizer;
    if (stryMutAct_9fa48("4783") ? transactions.length !== 0 : stryMutAct_9fa48("4782") ? false : stryMutAct_9fa48("4781") ? true : (stryCov_9fa48("4781", "4782", "4783"), transactions.length === 0)) {
      if (stryMutAct_9fa48("4784")) {
        {}
      } else {
        stryCov_9fa48("4784");
        return <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                    {searchQuery ? stryMutAct_9fa48("4785") ? "" : (stryCov_9fa48("4785"), 'No transactions found') : stryMutAct_9fa48("4786") ? "" : (stryCov_9fa48("4786"), 'No transactions yet')}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {searchQuery ? stryMutAct_9fa48("4787") ? "" : (stryCov_9fa48("4787"), 'Try a different search term') : stryMutAct_9fa48("4788") ? "" : (stryCov_9fa48("4788"), 'Add your first transaction to get started')}
                </p>
                {stryMutAct_9fa48("4791") ? searchQuery && onClearSearch || <button onClick={onClearSearch} className="mt-4 text-primary-500 text-sm font-bold hover:underline">
                        Clear Search
                    </button> : stryMutAct_9fa48("4790") ? false : stryMutAct_9fa48("4789") ? true : (stryCov_9fa48("4789", "4790", "4791"), (stryMutAct_9fa48("4793") ? searchQuery || onClearSearch : stryMutAct_9fa48("4792") ? true : (stryCov_9fa48("4792", "4793"), searchQuery && onClearSearch)) && <button onClick={onClearSearch} className="mt-4 text-primary-500 text-sm font-bold hover:underline">
                        Clear Search
                    </button>)}
            </div>;
      }
    }
    return <div ref={parentRef} className={stryMutAct_9fa48("4794") ? `` : (stryCov_9fa48("4794"), `bg-transparent overflow-y-auto overscroll-contain h-[calc(100vh-320px)] min-h-[400px] ${loading ? stryMutAct_9fa48("4795") ? "" : (stryCov_9fa48("4795"), 'opacity-40 grayscale-[0.5] pointer-events-none') : stryMutAct_9fa48("4796") ? "Stryker was here!" : (stryCov_9fa48("4796"), '')}`)}>
            <div style={stryMutAct_9fa48("4797") ? {} : (stryCov_9fa48("4797"), {
        height: stryMutAct_9fa48("4798") ? `` : (stryCov_9fa48("4798"), `${rowVirtualizer.getTotalSize()}px`),
        width: stryMutAct_9fa48("4799") ? "" : (stryCov_9fa48("4799"), '100%'),
        position: stryMutAct_9fa48("4800") ? "" : (stryCov_9fa48("4800"), 'relative')
      })}>
                {rowVirtualizer.getVirtualItems().map(virtualRow => {
          if (stryMutAct_9fa48("4801")) {
            {}
          } else {
            stryCov_9fa48("4801");
            const tx = transactions[virtualRow.index];
            // Safety check: ensure transaction exists (array may have changed)
            if (stryMutAct_9fa48("4804") ? false : stryMutAct_9fa48("4803") ? true : stryMutAct_9fa48("4802") ? tx : (stryCov_9fa48("4802", "4803", "4804"), !tx)) return null;
            return <div key={tx.id} data-index={virtualRow.index} ref={rowVirtualizer.measureElement} style={stryMutAct_9fa48("4805") ? {} : (stryCov_9fa48("4805"), {
              position: stryMutAct_9fa48("4806") ? "" : (stryCov_9fa48("4806"), 'absolute'),
              top: 0,
              left: 0,
              width: stryMutAct_9fa48("4807") ? "" : (stryCov_9fa48("4807"), '100%'),
              transform: stryMutAct_9fa48("4808") ? `` : (stryCov_9fa48("4808"), `translateY(${virtualRow.start}px)`)
            })} className="pb-2" // Gap between transaction cards only
            >
                            {isMobile ? <SwipeableTransactionItem transaction={tx} accountName={tx.accountName} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} /> : <TransactionItem transaction={tx} accountName={tx.accountName} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />}
                        </div>;
          }
        })}
            </div>
            {stryMutAct_9fa48("4811") ? !loading && transactions.length > 5 || <div className="py-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                        End of list
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 ml-2"></span>
                    </div>
                </div> : stryMutAct_9fa48("4810") ? false : stryMutAct_9fa48("4809") ? true : (stryCov_9fa48("4809", "4810", "4811"), (stryMutAct_9fa48("4813") ? !loading || transactions.length > 5 : stryMutAct_9fa48("4812") ? true : (stryCov_9fa48("4812", "4813"), (stryMutAct_9fa48("4814") ? loading : (stryCov_9fa48("4814"), !loading)) && (stryMutAct_9fa48("4817") ? transactions.length <= 5 : stryMutAct_9fa48("4816") ? transactions.length >= 5 : stryMutAct_9fa48("4815") ? true : (stryCov_9fa48("4815", "4816", "4817"), transactions.length > 5)))) && <div className="py-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                        End of list
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 ml-2"></span>
                    </div>
                </div>)}
        </div>;
  }
};