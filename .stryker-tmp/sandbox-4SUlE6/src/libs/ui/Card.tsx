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
import { cn } from '@/utils/cn';
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(stryMutAct_9fa48("8041") ? () => undefined : (stryCov_9fa48("8041"), ({
  className,
  ...props
}, ref) => <div ref={ref} className={cn(stryMutAct_9fa48("8042") ? "" : (stryCov_9fa48("8042"), 'rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50'), className)} {...props} />));
Card.displayName = stryMutAct_9fa48("8043") ? "" : (stryCov_9fa48("8043"), 'Card');
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(stryMutAct_9fa48("8044") ? () => undefined : (stryCov_9fa48("8044"), ({
  className,
  ...props
}, ref) => <div ref={ref} className={cn(stryMutAct_9fa48("8045") ? "" : (stryCov_9fa48("8045"), 'flex flex-col space-y-1.5 p-6'), className)} {...props} />));
CardHeader.displayName = stryMutAct_9fa48("8046") ? "" : (stryCov_9fa48("8046"), 'CardHeader');
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(stryMutAct_9fa48("8047") ? () => undefined : (stryCov_9fa48("8047"), ({
  className,
  ...props
}, ref) => <h3 ref={ref} className={cn(stryMutAct_9fa48("8048") ? "" : (stryCov_9fa48("8048"), 'text-lg font-semibold leading-none tracking-tight'), className)} {...props} />));
CardTitle.displayName = stryMutAct_9fa48("8049") ? "" : (stryCov_9fa48("8049"), 'CardTitle');
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(stryMutAct_9fa48("8050") ? () => undefined : (stryCov_9fa48("8050"), ({
  className,
  ...props
}, ref) => <p ref={ref} className={cn(stryMutAct_9fa48("8051") ? "" : (stryCov_9fa48("8051"), 'text-sm text-slate-500 dark:text-slate-400'), className)} {...props} />));
CardDescription.displayName = stryMutAct_9fa48("8052") ? "" : (stryCov_9fa48("8052"), 'CardDescription');
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(stryMutAct_9fa48("8053") ? () => undefined : (stryCov_9fa48("8053"), ({
  className,
  ...props
}, ref) => <div ref={ref} className={cn(stryMutAct_9fa48("8054") ? "" : (stryCov_9fa48("8054"), 'p-6 pt-0'), className)} {...props} />));
CardContent.displayName = stryMutAct_9fa48("8055") ? "" : (stryCov_9fa48("8055"), 'CardContent');
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(stryMutAct_9fa48("8056") ? () => undefined : (stryCov_9fa48("8056"), ({
  className,
  ...props
}, ref) => <div ref={ref} className={cn(stryMutAct_9fa48("8057") ? "" : (stryCov_9fa48("8057"), 'flex items-center p-6 pt-0'), className)} {...props} />));
CardFooter.displayName = stryMutAct_9fa48("8058") ? "" : (stryCov_9fa48("8058"), 'CardFooter');
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };