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
const buttonVariants = cva(stryMutAct_9fa48("8020") ? "" : (stryCov_9fa48("8020"), 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'), stryMutAct_9fa48("8021") ? {} : (stryCov_9fa48("8021"), {
  variants: stryMutAct_9fa48("8022") ? {} : (stryCov_9fa48("8022"), {
    variant: stryMutAct_9fa48("8023") ? {} : (stryCov_9fa48("8023"), {
      primary: stryMutAct_9fa48("8024") ? "" : (stryCov_9fa48("8024"), 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-100 dark:shadow-none focus-visible:ring-primary-500'),
      secondary: stryMutAct_9fa48("8025") ? "" : (stryCov_9fa48("8025"), 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-slate-400'),
      ghost: stryMutAct_9fa48("8026") ? "" : (stryCov_9fa48("8026"), 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus-visible:ring-slate-400')
    }),
    size: stryMutAct_9fa48("8027") ? {} : (stryCov_9fa48("8027"), {
      sm: stryMutAct_9fa48("8028") ? "" : (stryCov_9fa48("8028"), 'h-11 md:h-9 px-3 rounded-lg'),
      // 44px on mobile, 36px on desktop
      md: stryMutAct_9fa48("8029") ? "" : (stryCov_9fa48("8029"), 'h-11 px-6'),
      lg: stryMutAct_9fa48("8030") ? "" : (stryCov_9fa48("8030"), 'h-14 px-8 text-base'),
      icon: stryMutAct_9fa48("8031") ? "" : (stryCov_9fa48("8031"), 'h-11 w-11 md:h-10 md:w-10') // 44px on mobile, 40px on desktop
    })
  }),
  defaultVariants: stryMutAct_9fa48("8032") ? {} : (stryCov_9fa48("8032"), {
    variant: stryMutAct_9fa48("8033") ? "" : (stryCov_9fa48("8033"), 'primary'),
    size: stryMutAct_9fa48("8034") ? "" : (stryCov_9fa48("8034"), 'md')
  })
}));
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  isLoading,
  children,
  ...props
}, ref) => {
  if (stryMutAct_9fa48("8035")) {
    {}
  } else {
    stryCov_9fa48("8035");
    return <button className={cn(buttonVariants(stryMutAct_9fa48("8036") ? {} : (stryCov_9fa48("8036"), {
      variant,
      size,
      className
    })))} ref={ref} disabled={stryMutAct_9fa48("8039") ? isLoading && props.disabled : stryMutAct_9fa48("8038") ? false : stryMutAct_9fa48("8037") ? true : (stryCov_9fa48("8037", "8038", "8039"), isLoading || props.disabled)} {...props}>
                {isLoading ? <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" /> : null}
                {children}
            </button>;
  }
});
Button.displayName = stryMutAct_9fa48("8040") ? "" : (stryCov_9fa48("8040"), 'Button');
export { Button, buttonVariants };