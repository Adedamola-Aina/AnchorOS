/**
 * Skeleton Components
 * 
 * Loading skeleton placeholders for better UX than spinners.
 * Provides visual indication of content structure while loading.
 * 
 * @example
 * <Skeleton className="w-32 h-4" />
 * <TransactionSkeleton />
 * <AccountSkeleton />
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
interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component
 */
export const Skeleton: React.FC<SkeletonProps> = stryMutAct_9fa48("8059") ? () => undefined : (stryCov_9fa48("8059"), (() => {
  const Skeleton: React.FC<SkeletonProps> = ({
    className = stryMutAct_9fa48("8060") ? "Stryker was here!" : (stryCov_9fa48("8060"), '')
  }) => <div className={stryMutAct_9fa48("8061") ? `` : (stryCov_9fa48("8061"), `animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`)} aria-hidden="true" />;
  return Skeleton;
})());

/**
 * Transaction list item skeleton
 */
export const TransactionSkeleton: React.FC = stryMutAct_9fa48("8062") ? () => undefined : (stryCov_9fa48("8062"), (() => {
  const TransactionSkeleton: React.FC = () => <div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
        {/* Icon placeholder */}
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
            <Skeleton className="w-3/4 h-4 mb-2" />
            <Skeleton className="w-1/2 h-3" />
        </div>

        {/* Amount placeholder */}
        <Skeleton className="w-20 h-6 flex-shrink-0" />
    </div>;
  return TransactionSkeleton;
})());

/**
 * Account card skeleton
 */
export const AccountSkeleton: React.FC = stryMutAct_9fa48("8063") ? () => undefined : (stryCov_9fa48("8063"), (() => {
  const AccountSkeleton: React.FC = () => <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-16 h-3" />
            </div>
        </div>
        <Skeleton className="w-32 h-6" />
    </div>;
  return AccountSkeleton;
})());

/**
 * Commitment/Task item skeleton
 */
export const CommitmentSkeleton: React.FC = stryMutAct_9fa48("8064") ? () => undefined : (stryCov_9fa48("8064"), (() => {
  const CommitmentSkeleton: React.FC = () => <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
        <div className="flex-1">
            <Skeleton className="w-3/4 h-4 mb-1" />
            <Skeleton className="w-1/3 h-3" />
        </div>
        <Skeleton className="w-12 h-5 rounded-full" />
    </div>;
  return CommitmentSkeleton;
})());

/**
 * Dashboard widget skeleton
 */
export const DashboardWidgetSkeleton: React.FC = stryMutAct_9fa48("8065") ? () => undefined : (stryCov_9fa48("8065"), (() => {
  const DashboardWidgetSkeleton: React.FC = () => <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <Skeleton className="w-24 h-4 mb-4" />
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-full h-3" />
    </div>;
  return DashboardWidgetSkeleton;
})());

/**
 * List skeleton - renders multiple transaction skeletons
 */
interface ListSkeletonProps {
  count?: number;
  type?: 'transaction' | 'commitment' | 'account';
}
export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  type = stryMutAct_9fa48("8066") ? "" : (stryCov_9fa48("8066"), 'transaction')
}) => {
  if (stryMutAct_9fa48("8067")) {
    {}
  } else {
    stryCov_9fa48("8067");
    const SkeletonComponent = (stryMutAct_9fa48("8068") ? {} : (stryCov_9fa48("8068"), {
      transaction: TransactionSkeleton,
      commitment: CommitmentSkeleton,
      account: AccountSkeleton
    }))[type];
    return <div className="space-y-1">
            {Array.from(stryMutAct_9fa48("8069") ? {} : (stryCov_9fa48("8069"), {
        length: count
      })).map(stryMutAct_9fa48("8070") ? () => undefined : (stryCov_9fa48("8070"), (_, i) => <SkeletonComponent key={i} />))}
        </div>;
  }
};