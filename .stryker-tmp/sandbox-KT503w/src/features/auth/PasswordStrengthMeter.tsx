/**
 * PasswordStrengthMeter - Visual password strength indicator
 * 
 * Shows strength bar and requirement badges.
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
import { Check, Circle } from 'lucide-react';
import { AnchorLogo } from '../../components/shared';
interface PasswordStrengthMeterProps {
  password: string;
}
const getStrength = (pass: string) => {
  if (stryMutAct_9fa48("2130")) {
    {}
  } else {
    stryCov_9fa48("2130");
    if (stryMutAct_9fa48("2133") ? false : stryMutAct_9fa48("2132") ? true : stryMutAct_9fa48("2131") ? pass : (stryCov_9fa48("2131", "2132", "2133"), !pass)) return 0;
    let score = 0;
    if (stryMutAct_9fa48("2137") ? pass.length < 8 : stryMutAct_9fa48("2136") ? pass.length > 8 : stryMutAct_9fa48("2135") ? false : stryMutAct_9fa48("2134") ? true : (stryCov_9fa48("2134", "2135", "2136", "2137"), pass.length >= 8)) stryMutAct_9fa48("2138") ? score-- : (stryCov_9fa48("2138"), score++);
    if (stryMutAct_9fa48("2142") ? pass.length < 12 : stryMutAct_9fa48("2141") ? pass.length > 12 : stryMutAct_9fa48("2140") ? false : stryMutAct_9fa48("2139") ? true : (stryCov_9fa48("2139", "2140", "2141", "2142"), pass.length >= 12)) stryMutAct_9fa48("2143") ? score-- : (stryCov_9fa48("2143"), score++);
    if (stryMutAct_9fa48("2145") ? false : stryMutAct_9fa48("2144") ? true : (stryCov_9fa48("2144", "2145"), (stryMutAct_9fa48("2146") ? /[^A-Z]/ : (stryCov_9fa48("2146"), /[A-Z]/)).test(pass))) stryMutAct_9fa48("2147") ? score-- : (stryCov_9fa48("2147"), score++);
    if (stryMutAct_9fa48("2149") ? false : stryMutAct_9fa48("2148") ? true : (stryCov_9fa48("2148", "2149"), (stryMutAct_9fa48("2150") ? /[^0-9]/ : (stryCov_9fa48("2150"), /[0-9]/)).test(pass))) stryMutAct_9fa48("2151") ? score-- : (stryCov_9fa48("2151"), score++);
    if (stryMutAct_9fa48("2153") ? false : stryMutAct_9fa48("2152") ? true : (stryCov_9fa48("2152", "2153"), (stryMutAct_9fa48("2154") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("2154"), /[!@#$%^&*(),.?":{}|<>]/)).test(pass))) stryMutAct_9fa48("2155") ? score-- : (stryCov_9fa48("2155"), score++);
    return score;
  }
};
const strengthLabels = stryMutAct_9fa48("2156") ? [] : (stryCov_9fa48("2156"), [stryMutAct_9fa48("2157") ? "" : (stryCov_9fa48("2157"), 'Weak'), stryMutAct_9fa48("2158") ? "" : (stryCov_9fa48("2158"), 'Fair'), stryMutAct_9fa48("2159") ? "" : (stryCov_9fa48("2159"), 'Good'), stryMutAct_9fa48("2160") ? "" : (stryCov_9fa48("2160"), 'Strong'), stryMutAct_9fa48("2161") ? "" : (stryCov_9fa48("2161"), 'Extra Secure'), stryMutAct_9fa48("2162") ? "" : (stryCov_9fa48("2162"), 'Vault Layer')]);
const strengthColors = stryMutAct_9fa48("2163") ? [] : (stryCov_9fa48("2163"), [stryMutAct_9fa48("2164") ? {} : (stryCov_9fa48("2164"), {
  bar: stryMutAct_9fa48("2165") ? "" : (stryCov_9fa48("2165"), 'bg-slate-300'),
  text: stryMutAct_9fa48("2166") ? "" : (stryCov_9fa48("2166"), 'text-slate-400')
}), stryMutAct_9fa48("2167") ? {} : (stryCov_9fa48("2167"), {
  bar: stryMutAct_9fa48("2168") ? "" : (stryCov_9fa48("2168"), 'bg-red-400'),
  text: stryMutAct_9fa48("2169") ? "" : (stryCov_9fa48("2169"), 'text-red-500')
}), stryMutAct_9fa48("2170") ? {} : (stryCov_9fa48("2170"), {
  bar: stryMutAct_9fa48("2171") ? "" : (stryCov_9fa48("2171"), 'bg-orange-400'),
  text: stryMutAct_9fa48("2172") ? "" : (stryCov_9fa48("2172"), 'text-orange-500')
}), stryMutAct_9fa48("2173") ? {} : (stryCov_9fa48("2173"), {
  bar: stryMutAct_9fa48("2174") ? "" : (stryCov_9fa48("2174"), 'bg-yellow-400'),
  text: stryMutAct_9fa48("2175") ? "" : (stryCov_9fa48("2175"), 'text-yellow-600')
}), stryMutAct_9fa48("2176") ? {} : (stryCov_9fa48("2176"), {
  bar: stryMutAct_9fa48("2177") ? "" : (stryCov_9fa48("2177"), 'bg-emerald-400'),
  text: stryMutAct_9fa48("2178") ? "" : (stryCov_9fa48("2178"), 'text-emerald-500')
}), stryMutAct_9fa48("2179") ? {} : (stryCov_9fa48("2179"), {
  bar: stryMutAct_9fa48("2180") ? "" : (stryCov_9fa48("2180"), 'bg-cyan-500'),
  text: stryMutAct_9fa48("2181") ? "" : (stryCov_9fa48("2181"), 'text-cyan-500')
})]);
const requirements = stryMutAct_9fa48("2182") ? [] : (stryCov_9fa48("2182"), [stryMutAct_9fa48("2183") ? {} : (stryCov_9fa48("2183"), {
  label: stryMutAct_9fa48("2184") ? "" : (stryCov_9fa48("2184"), '12+ chars'),
  check: stryMutAct_9fa48("2185") ? () => undefined : (stryCov_9fa48("2185"), (p: string) => stryMutAct_9fa48("2189") ? p.length < 12 : stryMutAct_9fa48("2188") ? p.length > 12 : stryMutAct_9fa48("2187") ? false : stryMutAct_9fa48("2186") ? true : (stryCov_9fa48("2186", "2187", "2188", "2189"), p.length >= 12))
}), stryMutAct_9fa48("2190") ? {} : (stryCov_9fa48("2190"), {
  label: stryMutAct_9fa48("2191") ? "" : (stryCov_9fa48("2191"), 'Uppercase'),
  check: stryMutAct_9fa48("2192") ? () => undefined : (stryCov_9fa48("2192"), (p: string) => (stryMutAct_9fa48("2193") ? /[^A-Z]/ : (stryCov_9fa48("2193"), /[A-Z]/)).test(p))
}), stryMutAct_9fa48("2194") ? {} : (stryCov_9fa48("2194"), {
  label: stryMutAct_9fa48("2195") ? "" : (stryCov_9fa48("2195"), 'Number'),
  check: stryMutAct_9fa48("2196") ? () => undefined : (stryCov_9fa48("2196"), (p: string) => (stryMutAct_9fa48("2197") ? /[^0-9]/ : (stryCov_9fa48("2197"), /[0-9]/)).test(p))
}), stryMutAct_9fa48("2198") ? {} : (stryCov_9fa48("2198"), {
  label: stryMutAct_9fa48("2199") ? "" : (stryCov_9fa48("2199"), 'Symbol'),
  check: stryMutAct_9fa48("2200") ? () => undefined : (stryCov_9fa48("2200"), (p: string) => (stryMutAct_9fa48("2201") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("2201"), /[!@#$%^&*(),.?":{}|<>]/)).test(p))
})]);
export function PasswordStrengthMeter({
  password
}: PasswordStrengthMeterProps) {
  if (stryMutAct_9fa48("2202")) {
    {}
  } else {
    stryCov_9fa48("2202");
    const strength = getStrength(password);
    return <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Security Strength</span>
                <span className={stryMutAct_9fa48("2203") ? `` : (stryCov_9fa48("2203"), `text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${strengthColors[strength].text}`)}>
                    {stryMutAct_9fa48("2206") ? strength >= 5 || <AnchorLogo className="w-3 h-3 animate-in zoom-in duration-300" /> : stryMutAct_9fa48("2205") ? false : stryMutAct_9fa48("2204") ? true : (stryCov_9fa48("2204", "2205", "2206"), (stryMutAct_9fa48("2209") ? strength < 5 : stryMutAct_9fa48("2208") ? strength > 5 : stryMutAct_9fa48("2207") ? true : (stryCov_9fa48("2207", "2208", "2209"), strength >= 5)) && <AnchorLogo className="w-3 h-3 animate-in zoom-in duration-300" />)}
                    {strengthLabels[strength]}
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                {(stryMutAct_9fa48("2210") ? [] : (stryCov_9fa48("2210"), [...(stryMutAct_9fa48("2211") ? Array() : (stryCov_9fa48("2211"), Array(5)))])).map(stryMutAct_9fa48("2212") ? () => undefined : (stryCov_9fa48("2212"), (_, i) => <div key={i} className={stryMutAct_9fa48("2213") ? `` : (stryCov_9fa48("2213"), `h-full flex-1 rounded-full transition-all duration-500 ${(stryMutAct_9fa48("2217") ? i >= strength : stryMutAct_9fa48("2216") ? i <= strength : stryMutAct_9fa48("2215") ? false : stryMutAct_9fa48("2214") ? true : (stryCov_9fa48("2214", "2215", "2216", "2217"), i < strength)) ? strengthColors[strength].bar : stryMutAct_9fa48("2218") ? "" : (stryCov_9fa48("2218"), 'bg-transparent')}`)} />))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
                {requirements.map((req, i) => {
          if (stryMutAct_9fa48("2219")) {
            {}
          } else {
            stryCov_9fa48("2219");
            const met = req.check(password);
            return <span key={i} className={stryMutAct_9fa48("2220") ? `` : (stryCov_9fa48("2220"), `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all duration-300 ${met ? stryMutAct_9fa48("2221") ? "" : (stryCov_9fa48("2221"), 'bg-emerald-500 text-white shadow-sm') : stryMutAct_9fa48("2222") ? "" : (stryCov_9fa48("2222"), 'bg-slate-100 dark:bg-slate-800 text-slate-400')}`)}>
                            {met ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                            {req.label}
                        </span>;
          }
        })}
            </div>
        </div>;
  }
}