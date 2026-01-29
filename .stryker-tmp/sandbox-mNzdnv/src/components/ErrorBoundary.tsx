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
import { AlertTriangle, RefreshCw, Copy, ChevronDown, ChevronUp } from 'lucide-react';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

/**
 * Error Boundary component for catching and displaying React errors gracefully.
 * This prevents white screen crashes and shows helpful debugging info.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = stryMutAct_9fa48("202") ? {} : (stryCov_9fa48("202"), {
      hasError: stryMutAct_9fa48("203") ? true : (stryCov_9fa48("203"), false),
      error: null,
      errorInfo: null,
      showDetails: stryMutAct_9fa48("204") ? true : (stryCov_9fa48("204"), false)
    });
  }
  static getDerivedStateFromError(error: Error): Partial<State> {
    if (stryMutAct_9fa48("205")) {
      {}
    } else {
      stryCov_9fa48("205");
      return stryMutAct_9fa48("206") ? {} : (stryCov_9fa48("206"), {
        hasError: stryMutAct_9fa48("207") ? false : (stryCov_9fa48("207"), true),
        error
      });
    }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (stryMutAct_9fa48("208")) {
      {}
    } else {
      stryCov_9fa48("208");
      this.setState(stryMutAct_9fa48("209") ? {} : (stryCov_9fa48("209"), {
        errorInfo
      }));
      // Log to console for debugging
      console.error(stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), 'ErrorBoundary caught error:'), error);
      console.error(stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'Component Stack:'), errorInfo.componentStack);
    }
  }
  handleReset = () => {
    if (stryMutAct_9fa48("212")) {
      {}
    } else {
      stryCov_9fa48("212");
      this.setState(stryMutAct_9fa48("213") ? {} : (stryCov_9fa48("213"), {
        hasError: stryMutAct_9fa48("214") ? true : (stryCov_9fa48("214"), false),
        error: null,
        errorInfo: null,
        showDetails: stryMutAct_9fa48("215") ? true : (stryCov_9fa48("215"), false)
      }));
    }
  };
  handleCopyError = () => {
    if (stryMutAct_9fa48("216")) {
      {}
    } else {
      stryCov_9fa48("216");
      const {
        error,
        errorInfo
      } = this.state;
      const errorText = stryMutAct_9fa48("217") ? `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
        ` : (stryCov_9fa48("217"), (stryMutAct_9fa48("218") ? `` : (stryCov_9fa48("218"), `
Error: ${stryMutAct_9fa48("219") ? error.message : (stryCov_9fa48("219"), error?.message)}
Stack: ${stryMutAct_9fa48("220") ? error.stack : (stryCov_9fa48("220"), error?.stack)}
Component Stack: ${stryMutAct_9fa48("221") ? errorInfo.componentStack : (stryCov_9fa48("221"), errorInfo?.componentStack)}
        `)).trim());
      navigator.clipboard.writeText(errorText);
    }
  };
  render() {
    if (stryMutAct_9fa48("222")) {
      {}
    } else {
      stryCov_9fa48("222");
      if (stryMutAct_9fa48("224") ? false : stryMutAct_9fa48("223") ? true : (stryCov_9fa48("223", "224"), this.state.hasError)) {
        if (stryMutAct_9fa48("225")) {
          {}
        } else {
          stryCov_9fa48("225");
          if (stryMutAct_9fa48("227") ? false : stryMutAct_9fa48("226") ? true : (stryCov_9fa48("226", "227"), this.props.fallback)) {
            if (stryMutAct_9fa48("228")) {
              {}
            } else {
              stryCov_9fa48("228");
              return this.props.fallback;
            }
          }
          const {
            error,
            errorInfo,
            showDetails
          } = this.state;
          const componentName = stryMutAct_9fa48("231") ? this.props.componentName && 'Component' : stryMutAct_9fa48("230") ? false : stryMutAct_9fa48("229") ? true : (stryCov_9fa48("229", "230", "231"), this.props.componentName || (stryMutAct_9fa48("232") ? "" : (stryCov_9fa48("232"), 'Component')));
          return <div className="min-h-[300px] flex items-center justify-center p-6">
                    <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-rose-200 dark:border-rose-500/30 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-4 text-white">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold">Something went wrong</h3>
                                    <p className="text-sm opacity-90">{componentName} encountered an error</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg break-all">
                                {stryMutAct_9fa48("235") ? error?.message && 'Unknown error' : stryMutAct_9fa48("234") ? false : stryMutAct_9fa48("233") ? true : (stryCov_9fa48("233", "234", "235"), (stryMutAct_9fa48("236") ? error.message : (stryCov_9fa48("236"), error?.message)) || (stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), 'Unknown error')))}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 flex gap-3">
                            <button onClick={this.handleReset} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button onClick={this.handleCopyError} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors" title="Copy error details">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Details Toggle */}
                        <div className="border-t border-slate-200 dark:border-slate-700">
                            <button onClick={stryMutAct_9fa48("238") ? () => undefined : (stryCov_9fa48("238"), () => this.setState(stryMutAct_9fa48("239") ? {} : (stryCov_9fa48("239"), {
                  showDetails: stryMutAct_9fa48("240") ? showDetails : (stryCov_9fa48("240"), !showDetails)
                })))} className="w-full p-3 flex items-center justify-between text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span>Technical Details</span>
                                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {stryMutAct_9fa48("243") ? showDetails || <div className="p-4 bg-slate-50 dark:bg-slate-800/50 max-h-64 overflow-auto">
                                    <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">
                                        {error?.stack}
                                        {'\n\n--- Component Stack ---\n'}
                                        {errorInfo?.componentStack}
                                    </pre>
                                </div> : stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : (stryCov_9fa48("241", "242", "243"), showDetails && <div className="p-4 bg-slate-50 dark:bg-slate-800/50 max-h-64 overflow-auto">
                                    <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">
                                        {stryMutAct_9fa48("244") ? error.stack : (stryCov_9fa48("244"), error?.stack)}
                                        {stryMutAct_9fa48("245") ? "" : (stryCov_9fa48("245"), '\n\n--- Component Stack ---\n')}
                                        {stryMutAct_9fa48("246") ? errorInfo.componentStack : (stryCov_9fa48("246"), errorInfo?.componentStack)}
                                    </pre>
                                </div>)}
                        </div>
                    </div>
                </div>;
        }
      }
      return this.props.children;
    }
  }
}
export default ErrorBoundary;