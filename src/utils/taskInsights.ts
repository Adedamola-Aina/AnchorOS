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
import type { AnchorTask } from '../types';
export interface ProductivityMetrics {
  score: number; // 0-100 percentage
  trend: 'improving' | 'declining' | 'stable';
  completedCount: number;
  totalCount: number;
  domainBreakdown: {
    personal: number; // percent
    family: number; // percent
  };
  insight: string | null;
}
export const getProductivityMetrics = (tasks: AnchorTask[]): ProductivityMetrics => {
  if (stryMutAct_9fa48("2080")) {
    {}
  } else {
    stryCov_9fa48("2080");
    // In a real app with history, we'd query "TaskCompletions" collection.
    // Here, we only have the current state of tasks. 
    // Heuristic: We can't easily calculate "trend" without history logs.
    // However, if we assume 'completed' tasks effectively represent recent activity (or resets), 
    // we can calculate a simplified "current state" score.

    // For the sake of the "Life at a Glance" UI, we will calculate based on:
    // Standing Commitments (Daily/Weekly) vs Completion status.

    if (stryMutAct_9fa48("2083") ? tasks.length !== 0 : stryMutAct_9fa48("2082") ? false : stryMutAct_9fa48("2081") ? true : (stryCov_9fa48("2081", "2082", "2083"), tasks.length === 0)) {
      if (stryMutAct_9fa48("2084")) {
        {}
      } else {
        stryCov_9fa48("2084");
        return stryMutAct_9fa48("2085") ? {} : (stryCov_9fa48("2085"), {
          score: 0,
          trend: stryMutAct_9fa48("2086") ? "" : (stryCov_9fa48("2086"), 'stable'),
          completedCount: 0,
          totalCount: 0,
          domainBreakdown: stryMutAct_9fa48("2087") ? {} : (stryCov_9fa48("2087"), {
            personal: 0,
            family: 0
          }),
          insight: null
        });
      }
    }
    const total = tasks.length;
    const completed = stryMutAct_9fa48("2088") ? tasks.length : (stryCov_9fa48("2088"), tasks.filter(stryMutAct_9fa48("2089") ? () => undefined : (stryCov_9fa48("2089"), t => t.completed)).length);
    const score = Math.round(stryMutAct_9fa48("2090") ? completed / total / 100 : (stryCov_9fa48("2090"), (stryMutAct_9fa48("2091") ? completed * total : (stryCov_9fa48("2091"), completed / total)) * 100));

    // Domain Split
    const personalTasks = stryMutAct_9fa48("2092") ? tasks : (stryCov_9fa48("2092"), tasks.filter(stryMutAct_9fa48("2093") ? () => undefined : (stryCov_9fa48("2093"), t => stryMutAct_9fa48("2096") ? t.category !== 'personal' : stryMutAct_9fa48("2095") ? false : stryMutAct_9fa48("2094") ? true : (stryCov_9fa48("2094", "2095", "2096"), t.category === (stryMutAct_9fa48("2097") ? "" : (stryCov_9fa48("2097"), 'personal'))))));
    const familyTasks = stryMutAct_9fa48("2098") ? tasks : (stryCov_9fa48("2098"), tasks.filter(stryMutAct_9fa48("2099") ? () => undefined : (stryCov_9fa48("2099"), t => stryMutAct_9fa48("2102") ? t.category !== 'family' : stryMutAct_9fa48("2101") ? false : stryMutAct_9fa48("2100") ? true : (stryCov_9fa48("2100", "2101", "2102"), t.category === (stryMutAct_9fa48("2103") ? "" : (stryCov_9fa48("2103"), 'family'))))));
    const personalScore = (stryMutAct_9fa48("2107") ? personalTasks.length <= 0 : stryMutAct_9fa48("2106") ? personalTasks.length >= 0 : stryMutAct_9fa48("2105") ? false : stryMutAct_9fa48("2104") ? true : (stryCov_9fa48("2104", "2105", "2106", "2107"), personalTasks.length > 0)) ? Math.round(stryMutAct_9fa48("2108") ? personalTasks.filter(t => t.completed).length / personalTasks.length / 100 : (stryCov_9fa48("2108"), (stryMutAct_9fa48("2109") ? personalTasks.filter(t => t.completed).length * personalTasks.length : (stryCov_9fa48("2109"), (stryMutAct_9fa48("2110") ? personalTasks.length : (stryCov_9fa48("2110"), personalTasks.filter(stryMutAct_9fa48("2111") ? () => undefined : (stryCov_9fa48("2111"), t => t.completed)).length)) / personalTasks.length)) * 100)) : 0;
    const familyScore = (stryMutAct_9fa48("2115") ? familyTasks.length <= 0 : stryMutAct_9fa48("2114") ? familyTasks.length >= 0 : stryMutAct_9fa48("2113") ? false : stryMutAct_9fa48("2112") ? true : (stryCov_9fa48("2112", "2113", "2114", "2115"), familyTasks.length > 0)) ? Math.round(stryMutAct_9fa48("2116") ? familyTasks.filter(t => t.completed).length / familyTasks.length / 100 : (stryCov_9fa48("2116"), (stryMutAct_9fa48("2117") ? familyTasks.filter(t => t.completed).length * familyTasks.length : (stryCov_9fa48("2117"), (stryMutAct_9fa48("2118") ? familyTasks.length : (stryCov_9fa48("2118"), familyTasks.filter(stryMutAct_9fa48("2119") ? () => undefined : (stryCov_9fa48("2119"), t => t.completed)).length)) / familyTasks.length)) * 100)) : 0;

    // Insights Heuristics
    // 1. High Score
    let insight = null;
    if (stryMutAct_9fa48("2123") ? score <= 80 : stryMutAct_9fa48("2122") ? score >= 80 : stryMutAct_9fa48("2121") ? false : stryMutAct_9fa48("2120") ? true : (stryCov_9fa48("2120", "2121", "2122", "2123"), score > 80)) insight = stryMutAct_9fa48("2124") ? "" : (stryCov_9fa48("2124"), "Your consistency is outstanding this week!");else if (stryMutAct_9fa48("2128") ? score <= 50 : stryMutAct_9fa48("2127") ? score >= 50 : stryMutAct_9fa48("2126") ? false : stryMutAct_9fa48("2125") ? true : (stryCov_9fa48("2125", "2126", "2127", "2128"), score > 50)) insight = stryMutAct_9fa48("2129") ? "" : (stryCov_9fa48("2129"), "You're on track, keep pushing!");else if (stryMutAct_9fa48("2133") ? score <= 0 : stryMutAct_9fa48("2132") ? score >= 0 : stryMutAct_9fa48("2131") ? false : stryMutAct_9fa48("2130") ? true : (stryCov_9fa48("2130", "2131", "2132", "2133"), score > 0)) insight = stryMutAct_9fa48("2134") ? "" : (stryCov_9fa48("2134"), "Focus on one small win today.");

    // 2. Specific Domain Insight
    if (stryMutAct_9fa48("2138") ? personalScore <= familyScore + 20 : stryMutAct_9fa48("2137") ? personalScore >= familyScore + 20 : stryMutAct_9fa48("2136") ? false : stryMutAct_9fa48("2135") ? true : (stryCov_9fa48("2135", "2136", "2137", "2138"), personalScore > (stryMutAct_9fa48("2139") ? familyScore - 20 : (stryCov_9fa48("2139"), familyScore + 20)))) insight = stryMutAct_9fa48("2140") ? "" : (stryCov_9fa48("2140"), "Personal tasks are strong; don't forget family commitments.");
    if (stryMutAct_9fa48("2144") ? familyScore <= personalScore + 20 : stryMutAct_9fa48("2143") ? familyScore >= personalScore + 20 : stryMutAct_9fa48("2142") ? false : stryMutAct_9fa48("2141") ? true : (stryCov_9fa48("2141", "2142", "2143", "2144"), familyScore > (stryMutAct_9fa48("2145") ? personalScore - 20 : (stryCov_9fa48("2145"), personalScore + 20)))) insight = stryMutAct_9fa48("2146") ? "" : (stryCov_9fa48("2146"), "Great family focus! Take time for yourself too.");
    return stryMutAct_9fa48("2147") ? {} : (stryCov_9fa48("2147"), {
      score,
      trend: (stryMutAct_9fa48("2151") ? score <= 50 : stryMutAct_9fa48("2150") ? score >= 50 : stryMutAct_9fa48("2149") ? false : stryMutAct_9fa48("2148") ? true : (stryCov_9fa48("2148", "2149", "2150", "2151"), score > 50)) ? stryMutAct_9fa48("2152") ? "" : (stryCov_9fa48("2152"), 'improving') : stryMutAct_9fa48("2153") ? "" : (stryCov_9fa48("2153"), 'stable'),
      // simplistic placeholder
      completedCount: completed,
      totalCount: total,
      domainBreakdown: stryMutAct_9fa48("2154") ? {} : (stryCov_9fa48("2154"), {
        personal: personalScore,
        family: familyScore
      }),
      insight
    });
  }
};