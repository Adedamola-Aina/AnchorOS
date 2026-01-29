/**
 * CashFlowChart - Bar chart showing income vs expense trends
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
interface CashFlowChartProps {
  financialTrend: {
    date: string;
    income: number;
    expense: number;
  }[];
  cashFlowTotals: {
    income: number;
    expense: number;
  };
  transactions: AnchorTransaction[];
  fullWidth?: boolean;
}
export function CashFlowChart({
  financialTrend,
  cashFlowTotals,
  transactions,
  fullWidth
}: CashFlowChartProps) {
  if (stryMutAct_9fa48("3088")) {
    {}
  } else {
    stryCov_9fa48("3088");
    // Calculate momentum
    const now = new Date();
    const oneWeekAgo = new Date(stryMutAct_9fa48("3089") ? now.getTime() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("3089"), now.getTime() - (stryMutAct_9fa48("3090") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("3090"), (stryMutAct_9fa48("3091") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("3091"), (stryMutAct_9fa48("3092") ? 7 * 24 / 60 : (stryCov_9fa48("3092"), (stryMutAct_9fa48("3093") ? 7 / 24 : (stryCov_9fa48("3093"), 7 * 24)) * 60)) * 60)) * 1000))));
    const twoWeeksAgo = new Date(stryMutAct_9fa48("3094") ? now.getTime() + 14 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("3094"), now.getTime() - (stryMutAct_9fa48("3095") ? 14 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("3095"), (stryMutAct_9fa48("3096") ? 14 * 24 * 60 / 60 : (stryCov_9fa48("3096"), (stryMutAct_9fa48("3097") ? 14 * 24 / 60 : (stryCov_9fa48("3097"), (stryMutAct_9fa48("3098") ? 14 / 24 : (stryCov_9fa48("3098"), 14 * 24)) * 60)) * 60)) * 1000))));
    let currentNet = 0;
    let prevNet = 0;
    transactions.forEach(tx => {
      if (stryMutAct_9fa48("3099")) {
        {}
      } else {
        stryCov_9fa48("3099");
        if (stryMutAct_9fa48("3102") ? tx.type !== 'transfer' : stryMutAct_9fa48("3101") ? false : stryMutAct_9fa48("3100") ? true : (stryCov_9fa48("3100", "3101", "3102"), tx.type === (stryMutAct_9fa48("3103") ? "" : (stryCov_9fa48("3103"), 'transfer')))) return;
        const d = new Date(tx.date);
        const amount = fromCents(stryMutAct_9fa48("3106") ? tx.amountCents && 0 : stryMutAct_9fa48("3105") ? false : stryMutAct_9fa48("3104") ? true : (stryCov_9fa48("3104", "3105", "3106"), tx.amountCents || 0));
        const val = (stryMutAct_9fa48("3109") ? tx.type !== 'income' : stryMutAct_9fa48("3108") ? false : stryMutAct_9fa48("3107") ? true : (stryCov_9fa48("3107", "3108", "3109"), tx.type === (stryMutAct_9fa48("3110") ? "" : (stryCov_9fa48("3110"), 'income')))) ? amount : stryMutAct_9fa48("3111") ? +amount : (stryCov_9fa48("3111"), -amount);
        if (stryMutAct_9fa48("3115") ? d < oneWeekAgo : stryMutAct_9fa48("3114") ? d > oneWeekAgo : stryMutAct_9fa48("3113") ? false : stryMutAct_9fa48("3112") ? true : (stryCov_9fa48("3112", "3113", "3114", "3115"), d >= oneWeekAgo)) stryMutAct_9fa48("3116") ? currentNet -= val : (stryCov_9fa48("3116"), currentNet += val);else if (stryMutAct_9fa48("3120") ? d < twoWeeksAgo : stryMutAct_9fa48("3119") ? d > twoWeeksAgo : stryMutAct_9fa48("3118") ? false : stryMutAct_9fa48("3117") ? true : (stryCov_9fa48("3117", "3118", "3119", "3120"), d >= twoWeeksAgo)) stryMutAct_9fa48("3121") ? prevNet -= val : (stryCov_9fa48("3121"), prevNet += val);
      }
    });
    const diff = stryMutAct_9fa48("3122") ? currentNet + prevNet : (stryCov_9fa48("3122"), currentNet - prevNet);
    const isPositive = stryMutAct_9fa48("3126") ? diff < 0 : stryMutAct_9fa48("3125") ? diff > 0 : stryMutAct_9fa48("3124") ? false : stryMutAct_9fa48("3123") ? true : (stryCov_9fa48("3123", "3124", "3125", "3126"), diff >= 0);
    const percentChange = (stryMutAct_9fa48("3129") ? prevNet === 0 : stryMutAct_9fa48("3128") ? false : stryMutAct_9fa48("3127") ? true : (stryCov_9fa48("3127", "3128", "3129"), prevNet !== 0)) ? Math.round(stryMutAct_9fa48("3130") ? diff / Math.abs(prevNet) / 100 : (stryCov_9fa48("3130"), (stryMutAct_9fa48("3131") ? diff * Math.abs(prevNet) : (stryCov_9fa48("3131"), diff / Math.abs(prevNet))) * 100)) : (stryMutAct_9fa48("3134") ? currentNet === 0 : stryMutAct_9fa48("3133") ? false : stryMutAct_9fa48("3132") ? true : (stryCov_9fa48("3132", "3133", "3134"), currentNet !== 0)) ? 100 : 0;
    return <div className={stryMutAct_9fa48("3135") ? `` : (stryCov_9fa48("3135"), `glass-card p-6 min-w-0 flex flex-col ${fullWidth ? stryMutAct_9fa48("3136") ? "" : (stryCov_9fa48("3136"), 'lg:col-span-2') : stryMutAct_9fa48("3137") ? "Stryker was here!" : (stryCov_9fa48("3137"), '')}`)}>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Cash Flow (7 Days)</h4>
                    <div className="flex gap-4 mt-2">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">In</p>
                            <p className="font-financial font-bold text-emerald-500">₦{cashFlowTotals.income.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Out</p>
                            <p className="font-financial font-bold text-rose-500">₦{cashFlowTotals.expense.toLocaleString()}</p>
                        </div>
                    </div>
                    {stryMutAct_9fa48("3140") ? transactions.length > 0 || <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
                            <div className={`flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide gap-1 ${currentNet >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                                {currentNet >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>Net: ₦{currentNet.toLocaleString()}</span>
                            </div>
                            {prevNet !== 0 && <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {isPositive ? '+' : ''}{percentChange}%
                                </span>}
                        </div> : stryMutAct_9fa48("3139") ? false : stryMutAct_9fa48("3138") ? true : (stryCov_9fa48("3138", "3139", "3140"), (stryMutAct_9fa48("3143") ? transactions.length <= 0 : stryMutAct_9fa48("3142") ? transactions.length >= 0 : stryMutAct_9fa48("3141") ? true : (stryCov_9fa48("3141", "3142", "3143"), transactions.length > 0)) && <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
                            <div className={stryMutAct_9fa48("3144") ? `` : (stryCov_9fa48("3144"), `flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide gap-1 ${(stryMutAct_9fa48("3148") ? currentNet < 0 : stryMutAct_9fa48("3147") ? currentNet > 0 : stryMutAct_9fa48("3146") ? false : stryMutAct_9fa48("3145") ? true : (stryCov_9fa48("3145", "3146", "3147", "3148"), currentNet >= 0)) ? stryMutAct_9fa48("3149") ? "" : (stryCov_9fa48("3149"), 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400') : stryMutAct_9fa48("3150") ? "" : (stryCov_9fa48("3150"), 'bg-rose-500/10 text-rose-600 dark:text-rose-400')}`)}>
                                {(stryMutAct_9fa48("3154") ? currentNet < 0 : stryMutAct_9fa48("3153") ? currentNet > 0 : stryMutAct_9fa48("3152") ? false : stryMutAct_9fa48("3151") ? true : (stryCov_9fa48("3151", "3152", "3153", "3154"), currentNet >= 0)) ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>Net: ₦{currentNet.toLocaleString()}</span>
                            </div>
                            {stryMutAct_9fa48("3157") ? prevNet !== 0 || <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {isPositive ? '+' : ''}{percentChange}%
                                </span> : stryMutAct_9fa48("3156") ? false : stryMutAct_9fa48("3155") ? true : (stryCov_9fa48("3155", "3156", "3157"), (stryMutAct_9fa48("3159") ? prevNet === 0 : stryMutAct_9fa48("3158") ? true : (stryCov_9fa48("3158", "3159"), prevNet !== 0)) && <span className={stryMutAct_9fa48("3160") ? `` : (stryCov_9fa48("3160"), `text-[10px] font-bold ${isPositive ? stryMutAct_9fa48("3161") ? "" : (stryCov_9fa48("3161"), 'text-emerald-500') : stryMutAct_9fa48("3162") ? "" : (stryCov_9fa48("3162"), 'text-rose-500')}`)}>
                                    {isPositive ? stryMutAct_9fa48("3163") ? "" : (stryCov_9fa48("3163"), '+') : stryMutAct_9fa48("3164") ? "Stryker was here!" : (stryCov_9fa48("3164"), '')}{percentChange}%
                                </span>)}
                        </div>)}
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Expense</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%" debounce={1}>
                    <BarChart data={financialTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={stryMutAct_9fa48("3165") ? true : (stryCov_9fa48("3165"), false)} stroke="#334155" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={stryMutAct_9fa48("3166") ? true : (stryCov_9fa48("3166"), false)} axisLine={stryMutAct_9fa48("3167") ? true : (stryCov_9fa48("3167"), false)} />
                        <YAxis hide />
                        <Tooltip cursor={stryMutAct_9fa48("3168") ? {} : (stryCov_9fa48("3168"), {
              fill: stryMutAct_9fa48("3169") ? "" : (stryCov_9fa48("3169"), 'transparent')
            })} contentStyle={stryMutAct_9fa48("3170") ? {} : (stryCov_9fa48("3170"), {
              backgroundColor: stryMutAct_9fa48("3171") ? "" : (stryCov_9fa48("3171"), '#1e293b'),
              border: stryMutAct_9fa48("3172") ? "" : (stryCov_9fa48("3172"), 'none'),
              borderRadius: stryMutAct_9fa48("3173") ? "" : (stryCov_9fa48("3173"), '8px'),
              color: stryMutAct_9fa48("3174") ? "" : (stryCov_9fa48("3174"), '#fff')
            })} formatter={stryMutAct_9fa48("3175") ? () => undefined : (stryCov_9fa48("3175"), value => stryMutAct_9fa48("3176") ? [] : (stryCov_9fa48("3176"), [stryMutAct_9fa48("3177") ? `` : (stryCov_9fa48("3177"), `₦${Number(value).toLocaleString()}`), stryMutAct_9fa48("3178") ? "Stryker was here!" : (stryCov_9fa48("3178"), '')]))} />
                        <Bar dataKey="income" fill="#10b981" radius={stryMutAct_9fa48("3179") ? [] : (stryCov_9fa48("3179"), [4, 4, 0, 0])} barSize={20} />
                        <Bar dataKey="expense" fill="#f87171" radius={stryMutAct_9fa48("3180") ? [] : (stryCov_9fa48("3180"), [4, 4, 0, 0])} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>;
  }
}