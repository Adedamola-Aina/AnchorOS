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
import { AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
interface Props {
  featureName: string;
  onReset?: () => void;
  fallback?: ReactNode;
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Feature-level error boundary for graceful failure isolation.
 * Prevents errors in one feature from crashing the entire application.
 * 
 * @example
 * <FeatureErrorBoundary featureName="Finance">
 *   <FinanceView />
 * </FeatureErrorBoundary>
 */
export class FeatureErrorBoundary extends Component<Props, State> {
  public state: State = stryMutAct_9fa48("1144") ? {} : (stryCov_9fa48("1144"), {
    hasError: stryMutAct_9fa48("1145") ? true : (stryCov_9fa48("1145"), false),
    error: null
  });
  public static getDerivedStateFromError(error: Error): State {
    if (stryMutAct_9fa48("1146")) {
      {}
    } else {
      stryCov_9fa48("1146");
      return stryMutAct_9fa48("1147") ? {} : (stryCov_9fa48("1147"), {
        hasError: stryMutAct_9fa48("1148") ? false : (stryCov_9fa48("1148"), true),
        error
      });
    }
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (stryMutAct_9fa48("1149")) {
      {}
    } else {
      stryCov_9fa48("1149");
      // Log error for debugging (dev mode only shows in console)
      console.error(stryMutAct_9fa48("1150") ? `` : (stryCov_9fa48("1150"), `[${this.props.featureName}] Error caught by boundary:`), error);
      if (stryMutAct_9fa48("1152") ? false : stryMutAct_9fa48("1151") ? true : (stryCov_9fa48("1151", "1152"), import.meta.env.DEV)) {
        if (stryMutAct_9fa48("1153")) {
          {}
        } else {
          stryCov_9fa48("1153");
          console.error(stryMutAct_9fa48("1154") ? "" : (stryCov_9fa48("1154"), 'Error Info:'), errorInfo);
        }
      }
    }
  }
  private handleReset = () => {
    if (stryMutAct_9fa48("1155")) {
      {}
    } else {
      stryCov_9fa48("1155");
      // Call optional reset callback
      stryMutAct_9fa48("1156") ? this.props.onReset() : (stryCov_9fa48("1156"), this.props.onReset?.());

      // Reset error state to retry rendering
      this.setState(stryMutAct_9fa48("1157") ? {} : (stryCov_9fa48("1157"), {
        hasError: stryMutAct_9fa48("1158") ? true : (stryCov_9fa48("1158"), false),
        error: null
      }));
    }
  };
  private handleReport = () => {
    if (stryMutAct_9fa48("1159")) {
      {}
    } else {
      stryCov_9fa48("1159");
      const subject = encodeURIComponent(stryMutAct_9fa48("1160") ? `` : (stryCov_9fa48("1160"), `[Bug] ${this.props.featureName} Error`));
      const body = encodeURIComponent(stryMutAct_9fa48("1161") ? `` : (stryCov_9fa48("1161"), `Error in ${this.props.featureName}:\n\n${stryMutAct_9fa48("1164") ? this.state.error?.message && 'Unknown error' : stryMutAct_9fa48("1163") ? false : stryMutAct_9fa48("1162") ? true : (stryCov_9fa48("1162", "1163", "1164"), (stryMutAct_9fa48("1165") ? this.state.error.message : (stryCov_9fa48("1165"), this.state.error?.message)) || (stryMutAct_9fa48("1166") ? "" : (stryCov_9fa48("1166"), 'Unknown error')))}\n\nPlease describe what you were doing when this happened.`));
      window.location.href = stryMutAct_9fa48("1167") ? `` : (stryCov_9fa48("1167"), `mailto:workmail@adedamola.us?subject=${subject}&body=${body}`);
    }
  };
  public render() {
    if (stryMutAct_9fa48("1168")) {
      {}
    } else {
      stryCov_9fa48("1168");
      if (stryMutAct_9fa48("1170") ? false : stryMutAct_9fa48("1169") ? true : (stryCov_9fa48("1169", "1170"), this.state.hasError)) {
        if (stryMutAct_9fa48("1171")) {
          {}
        } else {
          stryCov_9fa48("1171");
          // Use custom fallback if provided
          if (stryMutAct_9fa48("1173") ? false : stryMutAct_9fa48("1172") ? true : (stryCov_9fa48("1172", "1173"), this.props.fallback)) {
            if (stryMutAct_9fa48("1174")) {
              {}
            } else {
              stryCov_9fa48("1174");
              return this.props.fallback;
            }
          }

          // Default error UI - mobile-responsive
          return <div className="w-full p-6 md:p-8">
                    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl border-2 border-rose-200 dark:border-rose-900/50 shadow-sm p-6">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white text-center mb-2">
                            Unable to load {this.props.featureName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
                            Something went wrong. Try reloading this section or navigate to another page.
                        </p>

                        {/* Action Buttons - Mobile: Stacked, Desktop: Side-by-side */}
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            <button onClick={this.handleReset} className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:scale-105 transition-transform w-full md:flex-1 min-h-[44px] md:min-h-0" aria-label={stryMutAct_9fa48("1175") ? `` : (stryCov_9fa48("1175"), `Retry loading ${this.props.featureName}`)}>
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <button onClick={this.handleReport} className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full md:flex-1 min-h-[44px] md:min-h-0" aria-label="Report this issue">
                                <MessageCircle className="w-5 h-5" />
                                Report Issue
                            </button>
                        </div>

                        {/* Dev Mode: Show Error Details */}
                        {stryMutAct_9fa48("1178") ? import.meta.env.DEV && this.state.error || <details className="mt-6">
                                <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                                    Show error details (dev only)
                                </summary>
                                <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs text-slate-600 dark:text-slate-400 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                                </pre>
                            </details> : stryMutAct_9fa48("1177") ? false : stryMutAct_9fa48("1176") ? true : (stryCov_9fa48("1176", "1177", "1178"), (stryMutAct_9fa48("1180") ? import.meta.env.DEV || this.state.error : stryMutAct_9fa48("1179") ? true : (stryCov_9fa48("1179", "1180"), import.meta.env.DEV && this.state.error)) && <details className="mt-6">
                                <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                                    Show error details (dev only)
                                </summary>
                                <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs text-slate-600 dark:text-slate-400 overflow-auto">
                                    {this.state.error.toString()}
                                    {stryMutAct_9fa48("1183") ? this.state.error.stack || `\n\n${this.state.error.stack}` : stryMutAct_9fa48("1182") ? false : stryMutAct_9fa48("1181") ? true : (stryCov_9fa48("1181", "1182", "1183"), this.state.error.stack && (stryMutAct_9fa48("1184") ? `` : (stryCov_9fa48("1184"), `\n\n${this.state.error.stack}`)))}
                                </pre>
                            </details>)}
                    </div>
                </div>;
        }
      }
      return this.props.children;
    }
  }
}