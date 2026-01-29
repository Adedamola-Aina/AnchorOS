/**
 * BottomNavigation - Mobile bottom tab navigation
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M3.1
 * Replaces hamburger drawer for primary navigation on mobile devices.
 * Fixed to bottom with safe area padding for notched devices.
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
import { LayoutDashboard, CheckCircle2, CreditCard, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
interface BottomNavigationProps {
  accountNotifications: string[];
}

// Static nav items moved outside component for performance (Virtual Board 8.3)
const NAV_ITEMS = [{
  to: '/dashboard',
  icon: LayoutDashboard,
  label: 'Home'
}, {
  to: '/commitments',
  icon: CheckCircle2,
  label: 'Tasks'
}, {
  to: '/finance',
  icon: CreditCard,
  label: 'Finance'
}, {
  to: '/settings',
  icon: Settings,
  label: 'Settings'
}] as const;
export const BottomNavigation = ({
  accountNotifications
}: BottomNavigationProps) => {
  if (stryMutAct_9fa48("558")) {
    {}
  } else {
    stryCov_9fa48("558");
    const hasSettingsNotification = stryMutAct_9fa48("562") ? accountNotifications.length <= 0 : stryMutAct_9fa48("561") ? accountNotifications.length >= 0 : stryMutAct_9fa48("560") ? false : stryMutAct_9fa48("559") ? true : (stryCov_9fa48("559", "560", "561", "562"), accountNotifications.length > 0);
    return <nav role="navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe z-40" aria-label="Mobile navigation">
            <div className="grid grid-cols-4 h-16">
                {NAV_ITEMS.map(stryMutAct_9fa48("563") ? () => undefined : (stryCov_9fa48("563"), ({
          to,
          icon: Icon,
          label
        }) => <NavLink key={to} to={to} className={stryMutAct_9fa48("564") ? () => undefined : (stryCov_9fa48("564"), ({
          isActive
        }) => stryMutAct_9fa48("565") ? `` : (stryCov_9fa48("565"), `flex flex-col items-center justify-center gap-1 relative transition-all min-h-[44px] ${isActive ? stryMutAct_9fa48("566") ? "" : (stryCov_9fa48("566"), 'text-primary-600 dark:text-primary-400') : stryMutAct_9fa48("567") ? "" : (stryCov_9fa48("567"), 'text-slate-400 dark:text-slate-500')}`))}>
                        {stryMutAct_9fa48("568") ? () => undefined : (stryCov_9fa48("568"), ({
            isActive
          }) => <>
                                <Icon className={stryMutAct_9fa48("569") ? `` : (stryCov_9fa48("569"), `w-5 h-5 ${isActive ? stryMutAct_9fa48("570") ? "" : (stryCov_9fa48("570"), 'scale-110') : stryMutAct_9fa48("571") ? "Stryker was here!" : (stryCov_9fa48("571"), '')} transition-transform`)} />
                                <span className="text-[10px] font-medium">{label}</span>
                                {stryMutAct_9fa48("574") ? to === '/settings' && hasSettingsNotification || <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse" role="status" aria-label="Notification indicator" /> : stryMutAct_9fa48("573") ? false : stryMutAct_9fa48("572") ? true : (stryCov_9fa48("572", "573", "574"), (stryMutAct_9fa48("576") ? to === '/settings' || hasSettingsNotification : stryMutAct_9fa48("575") ? true : (stryCov_9fa48("575", "576"), (stryMutAct_9fa48("578") ? to !== '/settings' : stryMutAct_9fa48("577") ? true : (stryCov_9fa48("577", "578"), to === (stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), '/settings')))) && hasSettingsNotification)) && <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse" role="status" aria-label="Notification indicator" />)}
                            </>)}
                    </NavLink>))}
            </div>
        </nav>;
  }
};

// Also export as BottomNav for backward compatibility
export const BottomNav = BottomNavigation;
export default BottomNavigation;