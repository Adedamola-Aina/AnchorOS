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
import { PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { AssetClass } from '../../../utils/financeInsights';
import type { Currency } from '../../../types';
interface AssetAllocationWidgetProps {
  assets: AssetClass[];
}
export const AssetAllocationWidget = ({
  assets
}: AssetAllocationWidgetProps) => {
  if (stryMutAct_9fa48("3022")) {
    {}
  } else {
    stryCov_9fa48("3022");
    const [expanded, setExpanded] = useState(stryMutAct_9fa48("3023") ? true : (stryCov_9fa48("3023"), false));

    // Sort by percentage desc
    const sortedAssets = stryMutAct_9fa48("3024") ? [...assets] : (stryCov_9fa48("3024"), (stryMutAct_9fa48("3025") ? [] : (stryCov_9fa48("3025"), [...assets])).sort(stryMutAct_9fa48("3026") ? () => undefined : (stryCov_9fa48("3026"), (a, b) => stryMutAct_9fa48("3027") ? b.percent + a.percent : (stryCov_9fa48("3027"), b.percent - a.percent))));

    // Colors for visualization
    const COLORS = stryMutAct_9fa48("3028") ? [] : (stryCov_9fa48("3028"), [stryMutAct_9fa48("3029") ? "" : (stryCov_9fa48("3029"), 'bg-primary-500'), stryMutAct_9fa48("3030") ? "" : (stryCov_9fa48("3030"), 'bg-emerald-500'), stryMutAct_9fa48("3031") ? "" : (stryCov_9fa48("3031"), 'bg-blue-500'), stryMutAct_9fa48("3032") ? "" : (stryCov_9fa48("3032"), 'bg-task-500'), stryMutAct_9fa48("3033") ? "" : (stryCov_9fa48("3033"), 'bg-amber-500'), stryMutAct_9fa48("3034") ? "" : (stryCov_9fa48("3034"), 'bg-rose-500'), stryMutAct_9fa48("3035") ? "" : (stryCov_9fa48("3035"), 'bg-cyan-500'), stryMutAct_9fa48("3036") ? "" : (stryCov_9fa48("3036"), 'bg-slate-500')]);
    const getColor = stryMutAct_9fa48("3037") ? () => undefined : (stryCov_9fa48("3037"), (() => {
      const getColor = (i: number) => COLORS[stryMutAct_9fa48("3038") ? i * COLORS.length : (stryCov_9fa48("3038"), i % COLORS.length)];
      return getColor;
    })());
    return <div className={stryMutAct_9fa48("3039") ? `` : (stryCov_9fa48("3039"), `glass-card p-6 transition-all duration-300 ${expanded ? stryMutAct_9fa48("3040") ? "" : (stryCov_9fa48("3040"), 'row-span-2') : stryMutAct_9fa48("3041") ? "Stryker was here!" : (stryCov_9fa48("3041"), '')}`)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <PieChart className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Asset Split</h3>
                </div>
                <button onClick={stryMutAct_9fa48("3042") ? () => undefined : (stryCov_9fa48("3042"), () => setExpanded(stryMutAct_9fa48("3043") ? expanded : (stryCov_9fa48("3043"), !expanded)))} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {/* Bar Chart Visualization */}
            <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5 mb-6">
                {sortedAssets.map(stryMutAct_9fa48("3044") ? () => undefined : (stryCov_9fa48("3044"), (asset, i) => <div key={asset.id} style={stryMutAct_9fa48("3045") ? {} : (stryCov_9fa48("3045"), {
          width: stryMutAct_9fa48("3046") ? `` : (stryCov_9fa48("3046"), `${asset.percent}%`)
        })} className={stryMutAct_9fa48("3047") ? `` : (stryCov_9fa48("3047"), `h-full ${getColor(i)} hover:opacity-80 transition-opacity cursor-help`)} title={stryMutAct_9fa48("3048") ? `` : (stryCov_9fa48("3048"), `${asset.name}: ${asset.percent.toFixed(1)}%`)} />))}
            </div>

            {/* Detailed Legend */}
            <div className="space-y-3">
                {(expanded ? sortedAssets : stryMutAct_9fa48("3049") ? sortedAssets : (stryCov_9fa48("3049"), sortedAssets.slice(0, 4))).map(stryMutAct_9fa48("3050") ? () => undefined : (stryCov_9fa48("3050"), (asset, i) => <div key={asset.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={stryMutAct_9fa48("3051") ? `` : (stryCov_9fa48("3051"), `w-3 h-3 rounded-full ${getColor(i)} ring-2 ring-white dark:ring-slate-900 shadow-sm`)} />
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{asset.name}</p>
                                {stryMutAct_9fa48("3054") ? expanded || <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.type}</p> : stryMutAct_9fa48("3053") ? false : stryMutAct_9fa48("3052") ? true : (stryCov_9fa48("3052", "3053", "3054"), expanded && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.type}</p>)}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                                {formatCurrency(asset.amount, asset.currency as Currency)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tabular-nums">
                                {asset.percent.toFixed(1)}%
                            </p>
                        </div>
                    </div>))}

                {stryMutAct_9fa48("3057") ? !expanded && sortedAssets.length > 4 || <button onClick={() => setExpanded(true)} className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary-500 mt-2 py-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                        View {sortedAssets.length - 4} More
                    </button> : stryMutAct_9fa48("3056") ? false : stryMutAct_9fa48("3055") ? true : (stryCov_9fa48("3055", "3056", "3057"), (stryMutAct_9fa48("3059") ? !expanded || sortedAssets.length > 4 : stryMutAct_9fa48("3058") ? true : (stryCov_9fa48("3058", "3059"), (stryMutAct_9fa48("3060") ? expanded : (stryCov_9fa48("3060"), !expanded)) && (stryMutAct_9fa48("3063") ? sortedAssets.length <= 4 : stryMutAct_9fa48("3062") ? sortedAssets.length >= 4 : stryMutAct_9fa48("3061") ? true : (stryCov_9fa48("3061", "3062", "3063"), sortedAssets.length > 4)))) && <button onClick={stryMutAct_9fa48("3064") ? () => undefined : (stryCov_9fa48("3064"), () => setExpanded(stryMutAct_9fa48("3065") ? false : (stryCov_9fa48("3065"), true)))} className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary-500 mt-2 py-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                        View {stryMutAct_9fa48("3066") ? sortedAssets.length + 4 : (stryCov_9fa48("3066"), sortedAssets.length - 4)} More
                    </button>)}
            </div>
        </div>;
  }
};