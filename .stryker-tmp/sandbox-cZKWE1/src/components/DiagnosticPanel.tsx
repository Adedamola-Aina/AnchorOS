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
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
export function DiagnosticPanel() {
  if (stryMutAct_9fa48("164")) {
    {}
  } else {
    stryCov_9fa48("164");
    const {
      user
    } = useAuth();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("165") ? true : (stryCov_9fa48("165"), false));
    const [fixing, setFixing] = useState(stryMutAct_9fa48("166") ? true : (stryCov_9fa48("166"), false));
    const runDiagnostic = async () => {
      if (stryMutAct_9fa48("167")) {
        {}
      } else {
        stryCov_9fa48("167");
        setLoading(stryMutAct_9fa48("168") ? false : (stryCov_9fa48("168"), true));
        try {
          if (stryMutAct_9fa48("169")) {
            {}
          } else {
            stryCov_9fa48("169");
            const functions = getFunctions();
            const diagnose = httpsCallable(functions, stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), 'diagnoseFamilySharing'));
            const result = await diagnose();
            setReport(result.data);
            console.log(stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), 'DIAGNOSTIC REPORT:'), JSON.stringify(result.data, null, 2));
          }
        } catch (error) {
          if (stryMutAct_9fa48("172")) {
            {}
          } else {
            stryCov_9fa48("172");
            console.error(stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), 'Diagnostic error:'), error);
            setReport(stryMutAct_9fa48("174") ? {} : (stryCov_9fa48("174"), {
              error: String(error)
            }));
          }
        } finally {
          if (stryMutAct_9fa48("175")) {
            {}
          } else {
            stryCov_9fa48("175");
            setLoading(stryMutAct_9fa48("176") ? true : (stryCov_9fa48("176"), false));
          }
        }
      }
    };
    const fixSharedAccounts = async () => {
      if (stryMutAct_9fa48("177")) {
        {}
      } else {
        stryCov_9fa48("177");
        setFixing(stryMutAct_9fa48("178") ? false : (stryCov_9fa48("178"), true));
        try {
          if (stryMutAct_9fa48("179")) {
            {}
          } else {
            stryCov_9fa48("179");
            const functions = getFunctions();
            const fix = httpsCallable(functions, stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), 'forceUpdateAccountScope'));
            // Hardcoded account ID from diagnostic: Zenith Bank
            const result = await fix(stryMutAct_9fa48("181") ? {} : (stryCov_9fa48("181"), {
              accountId: stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), '47Ah2FnrcDJzDvxiLbBM')
            }));
            const data = result.data as any;
            alert((stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), '✅ ')) + data.message + (stryMutAct_9fa48("184") ? "" : (stryCov_9fa48("184"), '\n\nInvitee should refresh now!')));
            setReport(null);
          }
        } catch (error) {
          if (stryMutAct_9fa48("185")) {
            {}
          } else {
            stryCov_9fa48("185");
            console.error(stryMutAct_9fa48("186") ? "" : (stryCov_9fa48("186"), 'Fix error:'), error);
            alert((stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), '❌ Error: ')) + (error as Error).message);
          }
        } finally {
          if (stryMutAct_9fa48("188")) {
            {}
          } else {
            stryCov_9fa48("188");
            setFixing(stryMutAct_9fa48("189") ? true : (stryCov_9fa48("189"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("192") ? false : stryMutAct_9fa48("191") ? true : stryMutAct_9fa48("190") ? user : (stryCov_9fa48("190", "191", "192"), !user)) return null;
    return <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <button onClick={runDiagnostic} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm">
                {loading ? stryMutAct_9fa48("193") ? "" : (stryCov_9fa48("193"), 'Running...') : stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), '🔍 Run Diagnostic')}
            </button>

            <button onClick={fixSharedAccounts} disabled={fixing} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm">
                {fixing ? stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'Fixing...') : stryMutAct_9fa48("196") ? "" : (stryCov_9fa48("196"), '🔧 Fix Shared Accounts')}
            </button>

            {stryMutAct_9fa48("199") ? report || <div className="mt-4 max-w-2xl bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-h-96 overflow-auto">
                    <h3 className="font-bold mb-2">Diagnostic Report:</h3>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(report, null, 2)}
                    </pre>
                    <button onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(report, null, 2));
          alert('Copied to clipboard!');
        }} className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded">
                        Copy Report
                    </button>
                </div> : stryMutAct_9fa48("198") ? false : stryMutAct_9fa48("197") ? true : (stryCov_9fa48("197", "198", "199"), report && <div className="mt-4 max-w-2xl bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-h-96 overflow-auto">
                    <h3 className="font-bold mb-2">Diagnostic Report:</h3>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(report, null, 2)}
                    </pre>
                    <button onClick={() => {
          if (stryMutAct_9fa48("200")) {
            {}
          } else {
            stryCov_9fa48("200");
            navigator.clipboard.writeText(JSON.stringify(report, null, 2));
            alert(stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), 'Copied to clipboard!'));
          }
        }} className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded">
                        Copy Report
                    </button>
                </div>)}
        </div>;
  }
}