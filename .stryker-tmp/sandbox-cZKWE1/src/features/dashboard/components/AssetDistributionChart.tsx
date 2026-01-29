/**
 * AssetDistributionChart - Pie chart showing account distribution
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
interface AssetData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}
interface AssetDistributionChartProps {
  accountData: AssetData[];
}
export function AssetDistributionChart({
  accountData
}: AssetDistributionChartProps) {
  if (stryMutAct_9fa48("3067")) {
    {}
  } else {
    stryCov_9fa48("3067");
    return <div className="glass-card p-6 min-w-0 flex flex-col min-h-[400px]">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Asset Distribution</h4>
            <div className="flex-1 flex flex-col sm:flex-row gap-6 min-h-0">
                <div className="h-48 md:h-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%" debounce={1}>
                        <PieChart>
                            <Pie data={accountData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" labelLine={stryMutAct_9fa48("3068") ? true : (stryCov_9fa48("3068"), false)}>
                                {accountData.map(stryMutAct_9fa48("3069") ? () => undefined : (stryCov_9fa48("3069"), (entry, index) => <Cell key={stryMutAct_9fa48("3070") ? `` : (stryCov_9fa48("3070"), `cell-${index}`)} fill={entry.color} />))}
                            </Pie>
                            <Tooltip contentStyle={stryMutAct_9fa48("3071") ? {} : (stryCov_9fa48("3071"), {
                backgroundColor: stryMutAct_9fa48("3072") ? "" : (stryCov_9fa48("3072"), '#1e293b'),
                border: stryMutAct_9fa48("3073") ? "" : (stryCov_9fa48("3073"), 'none'),
                borderRadius: stryMutAct_9fa48("3074") ? "" : (stryCov_9fa48("3074"), '8px'),
                color: stryMutAct_9fa48("3075") ? "" : (stryCov_9fa48("3075"), '#fff')
              })} itemStyle={stryMutAct_9fa48("3076") ? {} : (stryCov_9fa48("3076"), {
                color: stryMutAct_9fa48("3077") ? "" : (stryCov_9fa48("3077"), '#fff')
              })} formatter={stryMutAct_9fa48("3078") ? () => undefined : (stryCov_9fa48("3078"), value => stryMutAct_9fa48("3079") ? [] : (stryCov_9fa48("3079"), [stryMutAct_9fa48("3080") ? `` : (stryCov_9fa48("3080"), `₦${Number(value).toLocaleString()}`), stryMutAct_9fa48("3081") ? "" : (stryCov_9fa48("3081"), 'Balance')]))} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="md:w-1/2 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {accountData.map(stryMutAct_9fa48("3082") ? () => undefined : (stryCov_9fa48("3082"), (item, idx) => <div key={idx} className="flex items-center justify-between text-xs group">
                            <div className="flex items-center gap-2 pr-2 min-w-0 flex-1">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={stryMutAct_9fa48("3083") ? {} : (stryCov_9fa48("3083"), {
                backgroundColor: item.color
              })} />
                                <span className="text-slate-600 dark:text-slate-400 font-medium truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-financial font-bold text-slate-900 dark:text-slate-200 shrink-0">
                                {Math.round(stryMutAct_9fa48("3084") ? item.value / accountData.reduce((acc, curr) => acc + curr.value, 0) / 100 : (stryCov_9fa48("3084"), (stryMutAct_9fa48("3085") ? item.value * accountData.reduce((acc, curr) => acc + curr.value, 0) : (stryCov_9fa48("3085"), item.value / accountData.reduce(stryMutAct_9fa48("3086") ? () => undefined : (stryCov_9fa48("3086"), (acc, curr) => stryMutAct_9fa48("3087") ? acc - curr.value : (stryCov_9fa48("3087"), acc + curr.value)), 0))) * 100))}%
                            </span>
                        </div>))}
                </div>
            </div>
        </div>;
  }
}