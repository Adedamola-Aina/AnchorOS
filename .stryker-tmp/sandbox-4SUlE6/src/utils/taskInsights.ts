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
  if (stryMutAct_9fa48("9769")) {
    {}
  } else {
    stryCov_9fa48("9769");
    // In a real app with history, we'd query "TaskCompletions" collection.
    // Here, we only have the current state of tasks. 
    // Heuristic: We can't easily calculate "trend" without history logs.
    // However, if we assume 'completed' tasks effectively represent recent activity (or resets), 
    // we can calculate a simplified "current state" score.

    // For the sake of the "Life at a Glance" UI, we will calculate based on:
    // Standing Commitments (Daily/Weekly) vs Completion status.

    if (stryMutAct_9fa48("9772") ? tasks.length !== 0 : stryMutAct_9fa48("9771") ? false : stryMutAct_9fa48("9770") ? true : (stryCov_9fa48("9770", "9771", "9772"), tasks.length === 0)) {
      if (stryMutAct_9fa48("9773")) {
        {}
      } else {
        stryCov_9fa48("9773");
        return stryMutAct_9fa48("9774") ? {} : (stryCov_9fa48("9774"), {
          score: 0,
          trend: stryMutAct_9fa48("9775") ? "" : (stryCov_9fa48("9775"), 'stable'),
          completedCount: 0,
          totalCount: 0,
          domainBreakdown: stryMutAct_9fa48("9776") ? {} : (stryCov_9fa48("9776"), {
            personal: 0,
            family: 0
          }),
          insight: null
        });
      }
    }
    const total = tasks.length;
    const completed = stryMutAct_9fa48("9777") ? tasks.length : (stryCov_9fa48("9777"), tasks.filter(stryMutAct_9fa48("9778") ? () => undefined : (stryCov_9fa48("9778"), t => t.completed)).length);
    const score = Math.round(stryMutAct_9fa48("9779") ? completed / total / 100 : (stryCov_9fa48("9779"), (stryMutAct_9fa48("9780") ? completed * total : (stryCov_9fa48("9780"), completed / total)) * 100));

    // Domain Split
    const personalTasks = stryMutAct_9fa48("9781") ? tasks : (stryCov_9fa48("9781"), tasks.filter(stryMutAct_9fa48("9782") ? () => undefined : (stryCov_9fa48("9782"), t => stryMutAct_9fa48("9785") ? t.category !== 'personal' : stryMutAct_9fa48("9784") ? false : stryMutAct_9fa48("9783") ? true : (stryCov_9fa48("9783", "9784", "9785"), t.category === (stryMutAct_9fa48("9786") ? "" : (stryCov_9fa48("9786"), 'personal'))))));
    const familyTasks = stryMutAct_9fa48("9787") ? tasks : (stryCov_9fa48("9787"), tasks.filter(stryMutAct_9fa48("9788") ? () => undefined : (stryCov_9fa48("9788"), t => stryMutAct_9fa48("9791") ? t.category !== 'family' : stryMutAct_9fa48("9790") ? false : stryMutAct_9fa48("9789") ? true : (stryCov_9fa48("9789", "9790", "9791"), t.category === (stryMutAct_9fa48("9792") ? "" : (stryCov_9fa48("9792"), 'family'))))));
    const personalScore = (stryMutAct_9fa48("9796") ? personalTasks.length <= 0 : stryMutAct_9fa48("9795") ? personalTasks.length >= 0 : stryMutAct_9fa48("9794") ? false : stryMutAct_9fa48("9793") ? true : (stryCov_9fa48("9793", "9794", "9795", "9796"), personalTasks.length > 0)) ? Math.round(stryMutAct_9fa48("9797") ? personalTasks.filter(t => t.completed).length / personalTasks.length / 100 : (stryCov_9fa48("9797"), (stryMutAct_9fa48("9798") ? personalTasks.filter(t => t.completed).length * personalTasks.length : (stryCov_9fa48("9798"), (stryMutAct_9fa48("9799") ? personalTasks.length : (stryCov_9fa48("9799"), personalTasks.filter(stryMutAct_9fa48("9800") ? () => undefined : (stryCov_9fa48("9800"), t => t.completed)).length)) / personalTasks.length)) * 100)) : 0;
    const familyScore = (stryMutAct_9fa48("9804") ? familyTasks.length <= 0 : stryMutAct_9fa48("9803") ? familyTasks.length >= 0 : stryMutAct_9fa48("9802") ? false : stryMutAct_9fa48("9801") ? true : (stryCov_9fa48("9801", "9802", "9803", "9804"), familyTasks.length > 0)) ? Math.round(stryMutAct_9fa48("9805") ? familyTasks.filter(t => t.completed).length / familyTasks.length / 100 : (stryCov_9fa48("9805"), (stryMutAct_9fa48("9806") ? familyTasks.filter(t => t.completed).length * familyTasks.length : (stryCov_9fa48("9806"), (stryMutAct_9fa48("9807") ? familyTasks.length : (stryCov_9fa48("9807"), familyTasks.filter(stryMutAct_9fa48("9808") ? () => undefined : (stryCov_9fa48("9808"), t => t.completed)).length)) / familyTasks.length)) * 100)) : 0;

    // Insights Heuristics
    // 1. High Score
    let insight = null;
    if (stryMutAct_9fa48("9812") ? score <= 80 : stryMutAct_9fa48("9811") ? score >= 80 : stryMutAct_9fa48("9810") ? false : stryMutAct_9fa48("9809") ? true : (stryCov_9fa48("9809", "9810", "9811", "9812"), score > 80)) insight = stryMutAct_9fa48("9813") ? "" : (stryCov_9fa48("9813"), "Your consistency is outstanding this week!");else if (stryMutAct_9fa48("9817") ? score <= 50 : stryMutAct_9fa48("9816") ? score >= 50 : stryMutAct_9fa48("9815") ? false : stryMutAct_9fa48("9814") ? true : (stryCov_9fa48("9814", "9815", "9816", "9817"), score > 50)) insight = stryMutAct_9fa48("9818") ? "" : (stryCov_9fa48("9818"), "You're on track, keep pushing!");else if (stryMutAct_9fa48("9822") ? score <= 0 : stryMutAct_9fa48("9821") ? score >= 0 : stryMutAct_9fa48("9820") ? false : stryMutAct_9fa48("9819") ? true : (stryCov_9fa48("9819", "9820", "9821", "9822"), score > 0)) insight = stryMutAct_9fa48("9823") ? "" : (stryCov_9fa48("9823"), "Focus on one small win today.");

    // 2. Specific Domain Insight
    if (stryMutAct_9fa48("9827") ? personalScore <= familyScore + 20 : stryMutAct_9fa48("9826") ? personalScore >= familyScore + 20 : stryMutAct_9fa48("9825") ? false : stryMutAct_9fa48("9824") ? true : (stryCov_9fa48("9824", "9825", "9826", "9827"), personalScore > (stryMutAct_9fa48("9828") ? familyScore - 20 : (stryCov_9fa48("9828"), familyScore + 20)))) insight = stryMutAct_9fa48("9829") ? "" : (stryCov_9fa48("9829"), "Personal tasks are strong; don't forget family commitments.");
    if (stryMutAct_9fa48("9833") ? familyScore <= personalScore + 20 : stryMutAct_9fa48("9832") ? familyScore >= personalScore + 20 : stryMutAct_9fa48("9831") ? false : stryMutAct_9fa48("9830") ? true : (stryCov_9fa48("9830", "9831", "9832", "9833"), familyScore > (stryMutAct_9fa48("9834") ? personalScore - 20 : (stryCov_9fa48("9834"), personalScore + 20)))) insight = stryMutAct_9fa48("9835") ? "" : (stryCov_9fa48("9835"), "Great family focus! Take time for yourself too.");
    return stryMutAct_9fa48("9836") ? {} : (stryCov_9fa48("9836"), {
      score,
      trend: (stryMutAct_9fa48("9840") ? score <= 50 : stryMutAct_9fa48("9839") ? score >= 50 : stryMutAct_9fa48("9838") ? false : stryMutAct_9fa48("9837") ? true : (stryCov_9fa48("9837", "9838", "9839", "9840"), score > 50)) ? stryMutAct_9fa48("9841") ? "" : (stryCov_9fa48("9841"), 'improving') : stryMutAct_9fa48("9842") ? "" : (stryCov_9fa48("9842"), 'stable'),
      // simplistic placeholder
      completedCount: completed,
      totalCount: total,
      domainBreakdown: stryMutAct_9fa48("9843") ? {} : (stryCov_9fa48("9843"), {
        personal: personalScore,
        family: familyScore
      }),
      insight
    });
  }
};