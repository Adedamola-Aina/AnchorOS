/**
 * Seeder Data Constants
 * Extracted from seeder.ts per CLAUDE.md §3.2
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
export const TITLES = stryMutAct_9fa48("9695") ? [] : (stryCov_9fa48("9695"), [stryMutAct_9fa48("9696") ? "" : (stryCov_9fa48("9696"), 'Groceries'), stryMutAct_9fa48("9697") ? "" : (stryCov_9fa48("9697"), 'Rent'), stryMutAct_9fa48("9698") ? "" : (stryCov_9fa48("9698"), 'Salary'), stryMutAct_9fa48("9699") ? "" : (stryCov_9fa48("9699"), 'Netflix'), stryMutAct_9fa48("9700") ? "" : (stryCov_9fa48("9700"), 'Coffee'), stryMutAct_9fa48("9701") ? "" : (stryCov_9fa48("9701"), 'Gym'), stryMutAct_9fa48("9702") ? "" : (stryCov_9fa48("9702"), 'Internet'), stryMutAct_9fa48("9703") ? "" : (stryCov_9fa48("9703"), 'Electricity'), stryMutAct_9fa48("9704") ? "" : (stryCov_9fa48("9704"), 'Dining Out'), stryMutAct_9fa48("9705") ? "" : (stryCov_9fa48("9705"), 'Freelance Project'), stryMutAct_9fa48("9706") ? "" : (stryCov_9fa48("9706"), 'Gas'), stryMutAct_9fa48("9707") ? "" : (stryCov_9fa48("9707"), 'Insurance'), stryMutAct_9fa48("9708") ? "" : (stryCov_9fa48("9708"), 'Phone Bill'), stryMutAct_9fa48("9709") ? "" : (stryCov_9fa48("9709"), 'School Fees'), stryMutAct_9fa48("9710") ? "" : (stryCov_9fa48("9710"), 'Books'), stryMutAct_9fa48("9711") ? "" : (stryCov_9fa48("9711"), 'Amazon'), stryMutAct_9fa48("9712") ? "" : (stryCov_9fa48("9712"), 'Apple'), stryMutAct_9fa48("9713") ? "" : (stryCov_9fa48("9713"), 'Spotify'), stryMutAct_9fa48("9714") ? "" : (stryCov_9fa48("9714"), 'Pharmacy'), stryMutAct_9fa48("9715") ? "" : (stryCov_9fa48("9715"), 'Vet')]);
export const ACCOUNT_NAMES = stryMutAct_9fa48("9716") ? [] : (stryCov_9fa48("9716"), [stryMutAct_9fa48("9717") ? "" : (stryCov_9fa48("9717"), 'Main Checking'), stryMutAct_9fa48("9718") ? "" : (stryCov_9fa48("9718"), 'Savings Goal'), stryMutAct_9fa48("9719") ? "" : (stryCov_9fa48("9719"), 'Emergency Fund'), stryMutAct_9fa48("9720") ? "" : (stryCov_9fa48("9720"), 'Travel Card'), stryMutAct_9fa48("9721") ? "" : (stryCov_9fa48("9721"), 'Investment Portfolio'), stryMutAct_9fa48("9722") ? "" : (stryCov_9fa48("9722"), 'Joint Account'), stryMutAct_9fa48("9723") ? "" : (stryCov_9fa48("9723"), 'House Fund')]);
export const TASK_TITLES = stryMutAct_9fa48("9724") ? [] : (stryCov_9fa48("9724"), [stryMutAct_9fa48("9725") ? "" : (stryCov_9fa48("9725"), 'Morning Jog'), stryMutAct_9fa48("9726") ? "" : (stryCov_9fa48("9726"), 'Read 30 mins'), stryMutAct_9fa48("9727") ? "" : (stryCov_9fa48("9727"), 'Weekly Review'), stryMutAct_9fa48("9728") ? "" : (stryCov_9fa48("9728"), 'Pay Bills'), stryMutAct_9fa48("9729") ? "" : (stryCov_9fa48("9729"), 'Call Mom'), stryMutAct_9fa48("9730") ? "" : (stryCov_9fa48("9730"), 'Gym Workout'), stryMutAct_9fa48("9731") ? "" : (stryCov_9fa48("9731"), 'Meal Prep'), stryMutAct_9fa48("9732") ? "" : (stryCov_9fa48("9732"), 'Clean House'), stryMutAct_9fa48("9733") ? "" : (stryCov_9fa48("9733"), 'Check Stocks'), stryMutAct_9fa48("9734") ? "" : (stryCov_9fa48("9734"), 'Plan Vacation'), stryMutAct_9fa48("9735") ? "" : (stryCov_9fa48("9735"), 'Bible Study'), stryMutAct_9fa48("9736") ? "" : (stryCov_9fa48("9736"), 'Code Review'), stryMutAct_9fa48("9737") ? "" : (stryCov_9fa48("9737"), 'Stretching')]);
export const CATEGORIES = stryMutAct_9fa48("9738") ? [] : (stryCov_9fa48("9738"), [stryMutAct_9fa48("9739") ? "" : (stryCov_9fa48("9739"), 'Living'), stryMutAct_9fa48("9740") ? "" : (stryCov_9fa48("9740"), 'Food'), stryMutAct_9fa48("9741") ? "" : (stryCov_9fa48("9741"), 'Entertainment'), stryMutAct_9fa48("9742") ? "" : (stryCov_9fa48("9742"), 'Health'), stryMutAct_9fa48("9743") ? "" : (stryCov_9fa48("9743"), 'Transport'), stryMutAct_9fa48("9744") ? "" : (stryCov_9fa48("9744"), 'Utilities'), stryMutAct_9fa48("9745") ? "" : (stryCov_9fa48("9745"), 'Personal'), stryMutAct_9fa48("9746") ? "" : (stryCov_9fa48("9746"), 'Income'), stryMutAct_9fa48("9747") ? "" : (stryCov_9fa48("9747"), 'Transfer')]);
export const DOMAINS = stryMutAct_9fa48("9748") ? [] : (stryCov_9fa48("9748"), [stryMutAct_9fa48("9749") ? "" : (stryCov_9fa48("9749"), 'Health'), stryMutAct_9fa48("9750") ? "" : (stryCov_9fa48("9750"), 'Fitness'), stryMutAct_9fa48("9751") ? "" : (stryCov_9fa48("9751"), 'Work'), stryMutAct_9fa48("9752") ? "" : (stryCov_9fa48("9752"), 'Bible'), stryMutAct_9fa48("9753") ? "" : (stryCov_9fa48("9753"), 'Personal Development'), stryMutAct_9fa48("9754") ? "" : (stryCov_9fa48("9754"), 'Financial')]);
export const ACCOUNT_COLORS = stryMutAct_9fa48("9755") ? [] : (stryCov_9fa48("9755"), [stryMutAct_9fa48("9756") ? "" : (stryCov_9fa48("9756"), '#3b82f6'), stryMutAct_9fa48("9757") ? "" : (stryCov_9fa48("9757"), '#10b981'), stryMutAct_9fa48("9758") ? "" : (stryCov_9fa48("9758"), '#f59e0b'), stryMutAct_9fa48("9759") ? "" : (stryCov_9fa48("9759"), '#8b5cf6'), stryMutAct_9fa48("9760") ? "" : (stryCov_9fa48("9760"), '#ef4444'), stryMutAct_9fa48("9761") ? "" : (stryCov_9fa48("9761"), '#ec4899'), stryMutAct_9fa48("9762") ? "" : (stryCov_9fa48("9762"), '#6366f1')]);
export const randomDate = (start: Date, end: Date): Date => {
  if (stryMutAct_9fa48("9763")) {
    {}
  } else {
    stryCov_9fa48("9763");
    return new Date(stryMutAct_9fa48("9764") ? start.getTime() - Math.random() * (end.getTime() - start.getTime()) : (stryCov_9fa48("9764"), start.getTime() + (stryMutAct_9fa48("9765") ? Math.random() / (end.getTime() - start.getTime()) : (stryCov_9fa48("9765"), Math.random() * (stryMutAct_9fa48("9766") ? end.getTime() + start.getTime() : (stryCov_9fa48("9766"), end.getTime() - start.getTime()))))));
  }
};
export const randomItem = stryMutAct_9fa48("9767") ? () => undefined : (stryCov_9fa48("9767"), (() => {
  const randomItem = <T,>(arr: T[]): T => arr[Math.floor(stryMutAct_9fa48("9768") ? Math.random() / arr.length : (stryCov_9fa48("9768"), Math.random() * arr.length))];
  return randomItem;
})());