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
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
const badgeVariants = cva(stryMutAct_9fa48("8006") ? "" : (stryCov_9fa48("8006"), 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2'), stryMutAct_9fa48("8007") ? {} : (stryCov_9fa48("8007"), {
  variants: stryMutAct_9fa48("8008") ? {} : (stryCov_9fa48("8008"), {
    variant: stryMutAct_9fa48("8009") ? {} : (stryCov_9fa48("8009"), {
      default: stryMutAct_9fa48("8010") ? "" : (stryCov_9fa48("8010"), 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80'),
      secondary: stryMutAct_9fa48("8011") ? "" : (stryCov_9fa48("8011"), 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80'),
      destructive: stryMutAct_9fa48("8012") ? "" : (stryCov_9fa48("8012"), 'border-transparent bg-rose-500 text-slate-50 hover:bg-rose-500/80 dark:bg-rose-900 dark:text-slate-50 dark:hover:bg-rose-900/80'),
      outline: stryMutAct_9fa48("8013") ? "" : (stryCov_9fa48("8013"), 'text-slate-950 dark:text-slate-50'),
      success: stryMutAct_9fa48("8014") ? "" : (stryCov_9fa48("8014"), 'border-transparent bg-emerald-500 text-white hover:bg-emerald-600'),
      warning: stryMutAct_9fa48("8015") ? "" : (stryCov_9fa48("8015"), 'border-transparent bg-amber-500 text-white hover:bg-amber-600')
    })
  }),
  defaultVariants: stryMutAct_9fa48("8016") ? {} : (stryCov_9fa48("8016"), {
    variant: stryMutAct_9fa48("8017") ? "" : (stryCov_9fa48("8017"), 'default')
  })
}));
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  if (stryMutAct_9fa48("8018")) {
    {}
  } else {
    stryCov_9fa48("8018");
    return <div className={cn(badgeVariants(stryMutAct_9fa48("8019") ? {} : (stryCov_9fa48("8019"), {
      variant
    })), className)} {...props} />;
  }
}
export { Badge, badgeVariants };