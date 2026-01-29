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
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
interface Props {
  children: ReactNode;
  componentName?: string;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = stryMutAct_9fa48("1073") ? {} : (stryCov_9fa48("1073"), {
    hasError: stryMutAct_9fa48("1074") ? true : (stryCov_9fa48("1074"), false),
    error: null
  });
  public static getDerivedStateFromError(error: Error): State {
    if (stryMutAct_9fa48("1075")) {
      {}
    } else {
      stryCov_9fa48("1075");
      return stryMutAct_9fa48("1076") ? {} : (stryCov_9fa48("1076"), {
        hasError: stryMutAct_9fa48("1077") ? false : (stryCov_9fa48("1077"), true),
        error
      });
    }
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (stryMutAct_9fa48("1078")) {
      {}
    } else {
      stryCov_9fa48("1078");
      console.error(stryMutAct_9fa48("1079") ? "" : (stryCov_9fa48("1079"), 'Uncaught error:'), error, errorInfo);
    }
  }
  public render() {
    if (stryMutAct_9fa48("1080")) {
      {}
    } else {
      stryCov_9fa48("1080");
      if (stryMutAct_9fa48("1082") ? false : stryMutAct_9fa48("1081") ? true : (stryCov_9fa48("1081", "1082"), this.state.hasError)) {
        if (stryMutAct_9fa48("1083")) {
          {}
        } else {
          stryCov_9fa48("1083");
          return <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
                    <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full mb-6">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-2">Something went wrong</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                        We encountered an unexpected error. Please try reloading the application.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={stryMutAct_9fa48("1084") ? () => undefined : (stryCov_9fa48("1084"), () => window.location.reload())} className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform">
                            <RefreshCw className="w-5 h-5" />
                            Reload Application
                        </button>
                        <button onClick={async () => {
                if (stryMutAct_9fa48("1085")) {
                  {}
                } else {
                  stryCov_9fa48("1085");
                  if (stryMutAct_9fa48("1087") ? false : stryMutAct_9fa48("1086") ? true : (stryCov_9fa48("1086", "1087"), window.confirm(stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), 'This will clear all local data and sign you out. Are you sure?')))) {
                    if (stryMutAct_9fa48("1089")) {
                      {}
                    } else {
                      stryCov_9fa48("1089");
                      // Clear everything
                      localStorage.clear();
                      sessionStorage.clear();

                      // Clear IndexedDB databases
                      if (stryMutAct_9fa48("1092") ? window.indexedDB || window.indexedDB.databases : stryMutAct_9fa48("1091") ? false : stryMutAct_9fa48("1090") ? true : (stryCov_9fa48("1090", "1091", "1092"), window.indexedDB && window.indexedDB.databases)) {
                        if (stryMutAct_9fa48("1093")) {
                          {}
                        } else {
                          stryCov_9fa48("1093");
                          const dbs = await window.indexedDB.databases();
                          dbs.forEach(db => {
                            if (stryMutAct_9fa48("1094")) {
                              {}
                            } else {
                              stryCov_9fa48("1094");
                              if (stryMutAct_9fa48("1096") ? false : stryMutAct_9fa48("1095") ? true : (stryCov_9fa48("1095", "1096"), db.name)) window.indexedDB.deleteDatabase(db.name);
                            }
                          });
                        }
                      }
                      window.location.href = stryMutAct_9fa48("1097") ? "" : (stryCov_9fa48("1097"), '/dashboard');
                    }
                  }
                }
              }} className="flex items-center gap-2 px-6 py-3 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                            <AlertCircle className="w-5 h-5" />
                            Reset App Data
                        </button>
                    </div>
                    {stryMutAct_9fa48("1100") ? import.meta.env.DEV && this.state.error || <pre className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-left overflow-auto max-w-lg text-slate-600 dark:text-slate-400">
                            {this.state.error.toString()}
                        </pre> : stryMutAct_9fa48("1099") ? false : stryMutAct_9fa48("1098") ? true : (stryCov_9fa48("1098", "1099", "1100"), (stryMutAct_9fa48("1102") ? import.meta.env.DEV || this.state.error : stryMutAct_9fa48("1101") ? true : (stryCov_9fa48("1101", "1102"), import.meta.env.DEV && this.state.error)) && <pre className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-left overflow-auto max-w-lg text-slate-600 dark:text-slate-400">
                            {this.state.error.toString()}
                        </pre>)}
                </div>;
        }
      }
      return this.props.children;
    }
  }
}