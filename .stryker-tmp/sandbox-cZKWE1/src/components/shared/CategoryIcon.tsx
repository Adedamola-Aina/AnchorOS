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
import React from 'react';
import { ShoppingBag, Car, Home, Zap, Briefcase, Tag, Heart, Film, Plane, GraduationCap, TrendingUp, ArrowLeftRight, RefreshCw, Coffee, type LucideIcon } from 'lucide-react';
interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}
const CATEGORY_MAP: Record<string, {
  icon: LucideIcon;
  color: string;
}> = stryMutAct_9fa48("859") ? {} : (stryCov_9fa48("859"), {
  food: stryMutAct_9fa48("860") ? {} : (stryCov_9fa48("860"), {
    icon: ShoppingBag,
    color: stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), 'text-orange-500 bg-orange-500/10')
  }),
  groceries: stryMutAct_9fa48("862") ? {} : (stryCov_9fa48("862"), {
    icon: ShoppingBag,
    color: stryMutAct_9fa48("863") ? "" : (stryCov_9fa48("863"), 'text-orange-500 bg-orange-500/10')
  }),
  dining: stryMutAct_9fa48("864") ? {} : (stryCov_9fa48("864"), {
    icon: Coffee,
    color: stryMutAct_9fa48("865") ? "" : (stryCov_9fa48("865"), 'text-amber-500 bg-amber-500/10')
  }),
  transport: stryMutAct_9fa48("866") ? {} : (stryCov_9fa48("866"), {
    icon: Car,
    color: stryMutAct_9fa48("867") ? "" : (stryCov_9fa48("867"), 'text-primary-500 bg-primary-500/10')
  }),
  housing: stryMutAct_9fa48("868") ? {} : (stryCov_9fa48("868"), {
    icon: Home,
    color: stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), 'text-primary-500 bg-primary-500/10')
  }),
  rent: stryMutAct_9fa48("870") ? {} : (stryCov_9fa48("870"), {
    icon: Home,
    color: stryMutAct_9fa48("871") ? "" : (stryCov_9fa48("871"), 'text-primary-500 bg-primary-500/10')
  }),
  utilities: stryMutAct_9fa48("872") ? {} : (stryCov_9fa48("872"), {
    icon: Zap,
    color: stryMutAct_9fa48("873") ? "" : (stryCov_9fa48("873"), 'text-yellow-500 bg-yellow-500/10')
  }),
  salary: stryMutAct_9fa48("874") ? {} : (stryCov_9fa48("874"), {
    icon: Briefcase,
    color: stryMutAct_9fa48("875") ? "" : (stryCov_9fa48("875"), 'text-finance-500 bg-finance-500/10')
  }),
  income: stryMutAct_9fa48("876") ? {} : (stryCov_9fa48("876"), {
    icon: TrendingUp,
    color: stryMutAct_9fa48("877") ? "" : (stryCov_9fa48("877"), 'text-finance-500 bg-finance-500/10')
  }),
  health: stryMutAct_9fa48("878") ? {} : (stryCov_9fa48("878"), {
    icon: Heart,
    color: stryMutAct_9fa48("879") ? "" : (stryCov_9fa48("879"), 'text-rose-500 bg-rose-500/10')
  }),
  entertainment: stryMutAct_9fa48("880") ? {} : (stryCov_9fa48("880"), {
    icon: Film,
    color: stryMutAct_9fa48("881") ? "" : (stryCov_9fa48("881"), 'text-purple-500 bg-purple-500/10')
  }),
  travel: stryMutAct_9fa48("882") ? {} : (stryCov_9fa48("882"), {
    icon: Plane,
    color: stryMutAct_9fa48("883") ? "" : (stryCov_9fa48("883"), 'text-cyan-500 bg-cyan-500/10')
  }),
  education: stryMutAct_9fa48("884") ? {} : (stryCov_9fa48("884"), {
    icon: GraduationCap,
    color: stryMutAct_9fa48("885") ? "" : (stryCov_9fa48("885"), 'text-slate-500 bg-slate-500/10')
  }),
  transfer: stryMutAct_9fa48("886") ? {} : (stryCov_9fa48("886"), {
    icon: ArrowLeftRight,
    color: stryMutAct_9fa48("887") ? "" : (stryCov_9fa48("887"), 'text-slate-500 bg-slate-500/10')
  }),
  conversion: stryMutAct_9fa48("888") ? {} : (stryCov_9fa48("888"), {
    icon: RefreshCw,
    color: stryMutAct_9fa48("889") ? "" : (stryCov_9fa48("889"), 'text-slate-500 bg-slate-500/10')
  }),
  general: stryMutAct_9fa48("890") ? {} : (stryCov_9fa48("890"), {
    icon: Tag,
    color: stryMutAct_9fa48("891") ? "" : (stryCov_9fa48("891"), 'text-slate-400 bg-slate-400/10')
  })
});
export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className = stryMutAct_9fa48("892") ? "Stryker was here!" : (stryCov_9fa48("892"), ''),
  size = 16
}) => {
  if (stryMutAct_9fa48("893")) {
    {}
  } else {
    stryCov_9fa48("893");
    const normalized = stryMutAct_9fa48("894") ? category.toUpperCase() : (stryCov_9fa48("894"), category.toLowerCase());
    const config = stryMutAct_9fa48("897") ? CATEGORY_MAP[normalized] && CATEGORY_MAP.general : stryMutAct_9fa48("896") ? false : stryMutAct_9fa48("895") ? true : (stryCov_9fa48("895", "896", "897"), CATEGORY_MAP[normalized] || CATEGORY_MAP.general);
    const Icon = config.icon;
    return <div className={stryMutAct_9fa48("898") ? `` : (stryCov_9fa48("898"), `p-2 rounded-lg ${config.color} ${className}`)}>
            <Icon size={size} strokeWidth={2.5} />
        </div>;
  }
};