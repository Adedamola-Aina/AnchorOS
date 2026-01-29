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
import React, { useContext } from 'react';
import { useFinanceService } from '../hooks/useFinanceService';
import { useAuth } from './AuthContext';
import { useFamilySharing } from '../hooks/useFamilySharing';
import { FinanceContext } from './FinanceContextDefinition';

// Re-export from definition
export { FinanceContext };
export const FinanceProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  if (stryMutAct_9fa48("1666")) {
    {}
  } else {
    stryCov_9fa48("1666");
    const {
      user,
      profile
    } = useAuth();
    const {
      familyMemberUid
    } = useFamilySharing(stryMutAct_9fa48("1667") ? user.uid : (stryCov_9fa48("1667"), user?.uid));
    const financeService = useFinanceService(user, familyMemberUid, stryMutAct_9fa48("1668") ? profile.name : (stryCov_9fa48("1668"), profile?.name));
    return <FinanceContext.Provider value={financeService}>
            {children}
        </FinanceContext.Provider>;
  }
};
export const useFinance = () => {
  if (stryMutAct_9fa48("1669")) {
    {}
  } else {
    stryCov_9fa48("1669");
    const context = useContext(FinanceContext);
    if (stryMutAct_9fa48("1672") ? context !== undefined : stryMutAct_9fa48("1671") ? false : stryMutAct_9fa48("1670") ? true : (stryCov_9fa48("1670", "1671", "1672"), context === undefined)) {
      if (stryMutAct_9fa48("1673")) {
        {}
      } else {
        stryCov_9fa48("1673");
        throw new Error(stryMutAct_9fa48("1674") ? "" : (stryCov_9fa48("1674"), 'useFinance must be used within a FinanceProvider'));
      }
    }
    return context;
  }
};