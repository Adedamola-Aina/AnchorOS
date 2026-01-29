/**
 * FabricSuggestionToast
 * 
 * Fabric v1.5: Smart suggestion toast that appears when completing financial commitments.
 * Auto-dismisses after 8 seconds with smooth exit animation.
 * 
 * @example
 * <FabricSuggestionToast suggestion={suggestion} />
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
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { FabricSuggestion } from '../../hooks/useFabricSuggestions';
interface FabricSuggestionToastProps {
  suggestion: FabricSuggestion;
}
export const FabricSuggestionToast: React.FC<FabricSuggestionToastProps> = ({
  suggestion
}) => {
  if (stryMutAct_9fa48("1103")) {
    {}
  } else {
    stryCov_9fa48("1103");
    const [isVisible, setIsVisible] = useState(stryMutAct_9fa48("1104") ? false : (stryCov_9fa48("1104"), true));
    const [isExiting, setIsExiting] = useState(stryMutAct_9fa48("1105") ? true : (stryCov_9fa48("1105"), false));
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Define handleDismiss before useEffect to avoid "accessed before declared" error
    const handleDismiss = React.useCallback(() => {
      if (stryMutAct_9fa48("1106")) {
        {}
      } else {
        stryCov_9fa48("1106");
        // Clear timer to prevent double-dismiss
        if (stryMutAct_9fa48("1108") ? false : stryMutAct_9fa48("1107") ? true : (stryCov_9fa48("1107", "1108"), timerRef.current)) {
          if (stryMutAct_9fa48("1109")) {
            {}
          } else {
            stryCov_9fa48("1109");
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
        setIsExiting(stryMutAct_9fa48("1110") ? false : (stryCov_9fa48("1110"), true));
        setTimeout(() => {
          if (stryMutAct_9fa48("1111")) {
            {}
          } else {
            stryCov_9fa48("1111");
            setIsVisible(stryMutAct_9fa48("1112") ? true : (stryCov_9fa48("1112"), false));
            suggestion.dismiss();
          }
        }, 300);
      }
    }, stryMutAct_9fa48("1113") ? [] : (stryCov_9fa48("1113"), [suggestion]));

    // Auto-dismiss after 8 seconds
    useEffect(() => {
      if (stryMutAct_9fa48("1114")) {
        {}
      } else {
        stryCov_9fa48("1114");
        timerRef.current = setTimeout(() => {
          if (stryMutAct_9fa48("1115")) {
            {}
          } else {
            stryCov_9fa48("1115");
            handleDismiss();
          }
        }, 8000);
        return () => {
          if (stryMutAct_9fa48("1116")) {
            {}
          } else {
            stryCov_9fa48("1116");
            if (stryMutAct_9fa48("1118") ? false : stryMutAct_9fa48("1117") ? true : (stryCov_9fa48("1117", "1118"), timerRef.current)) clearTimeout(timerRef.current);
          }
        };
      }
    }, stryMutAct_9fa48("1119") ? [] : (stryCov_9fa48("1119"), [handleDismiss]));
    const handleAction = () => {
      if (stryMutAct_9fa48("1120")) {
        {}
      } else {
        stryCov_9fa48("1120");
        // Clear timer before action to prevent memory leak
        if (stryMutAct_9fa48("1122") ? false : stryMutAct_9fa48("1121") ? true : (stryCov_9fa48("1121", "1122"), timerRef.current)) {
          if (stryMutAct_9fa48("1123")) {
            {}
          } else {
            stryCov_9fa48("1123");
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
        suggestion.action();
      }
    };
    if (stryMutAct_9fa48("1126") ? false : stryMutAct_9fa48("1125") ? true : stryMutAct_9fa48("1124") ? isVisible : (stryCov_9fa48("1124", "1125", "1126"), !isVisible)) return null;
    return <div role="alert" aria-live="polite" className={stryMutAct_9fa48("1127") ? `` : (stryCov_9fa48("1127"), `
        fixed bottom-6 right-6 z-50 max-w-sm w-full
        bg-white dark:bg-slate-800 
        rounded-2xl shadow-2xl 
        border border-slate-200 dark:border-slate-700 
        overflow-hidden
        transform transition-all duration-300 ease-out
        ${isExiting ? stryMutAct_9fa48("1128") ? "" : (stryCov_9fa48("1128"), 'translate-x-[120%] opacity-0') : stryMutAct_9fa48("1129") ? "" : (stryCov_9fa48("1129"), 'translate-x-0 opacity-100 animate-in slide-in-from-right-8')}
      `)}>
            {/* Progress bar for auto-dismiss */}
            <div className="h-1 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={stryMutAct_9fa48("1130") ? {} : (stryCov_9fa48("1130"), {
          animation: stryMutAct_9fa48("1131") ? "" : (stryCov_9fa48("1131"), 'shrink 8s linear forwards')
        })} />
            </div>

            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {suggestion.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {suggestion.message}
                        </p>

                        {/* Amount preview if available */}
                        {stryMutAct_9fa48("1134") ? suggestion.metadata?.amount || <p className="text-sm font-mono font-bold text-finance-600 dark:text-finance-400 mt-2">
                                ${suggestion.metadata.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2
              })}
                            </p> : stryMutAct_9fa48("1133") ? false : stryMutAct_9fa48("1132") ? true : (stryCov_9fa48("1132", "1133", "1134"), (stryMutAct_9fa48("1135") ? suggestion.metadata.amount : (stryCov_9fa48("1135"), suggestion.metadata?.amount)) && <p className="text-sm font-mono font-bold text-finance-600 dark:text-finance-400 mt-2">
                                ${suggestion.metadata.amount.toLocaleString(stryMutAct_9fa48("1136") ? "" : (stryCov_9fa48("1136"), 'en-US'), stryMutAct_9fa48("1137") ? {} : (stryCov_9fa48("1137"), {
                minimumFractionDigits: 2
              }))}
                            </p>)}
                    </div>

                    {/* Close button */}
                    <button onClick={handleDismiss} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label="Dismiss suggestion">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                    <button onClick={handleAction} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
                        Yes, Record
                    </button>
                    <button onClick={handleDismiss} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors">
                        Not now
                    </button>
                </div>
            </div>

            {/* CSS for progress bar animation */}
            <style>{stryMutAct_9fa48("1138") ? `` : (stryCov_9fa48("1138"), `
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `)}</style>
        </div>;
  }
};

/**
 * FabricSuggestionContainer
 * 
 * Renders multiple suggestions stacked.
 */
interface FabricSuggestionContainerProps {
  suggestions: FabricSuggestion[];
}
export const FabricSuggestionContainer: React.FC<FabricSuggestionContainerProps> = ({
  suggestions
}) => {
  if (stryMutAct_9fa48("1139")) {
    {}
  } else {
    stryCov_9fa48("1139");
    if (stryMutAct_9fa48("1142") ? suggestions.length !== 0 : stryMutAct_9fa48("1141") ? false : stryMutAct_9fa48("1140") ? true : (stryCov_9fa48("1140", "1141", "1142"), suggestions.length === 0)) return null;

    // Only show the most recent suggestion to avoid clutter
    const latestSuggestion = suggestions[stryMutAct_9fa48("1143") ? suggestions.length + 1 : (stryCov_9fa48("1143"), suggestions.length - 1)];
    return <FabricSuggestionToast suggestion={latestSuggestion} />;
  }
};