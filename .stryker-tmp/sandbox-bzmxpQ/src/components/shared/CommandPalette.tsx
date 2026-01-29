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
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ArrowRight, LayoutDashboard, CheckCircle2, CreditCard, Settings, Wallet, MinusCircle, PlusCircle, Plus } from 'lucide-react';
import { useApp } from '../../context/AnchorContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
interface CommandResult {
  id: string;
  title: string;
  type: string;
  icon: React.FC<{
    className?: string;
  }>;
  action: () => void;
}

// TODO: Future enhancement - track and display recent actions
// const getRecentActions = (): { id: string; title: string; type: string }[] => {
//     try { return JSON.parse(localStorage.getItem('anchor_recent_actions') || '[]'); }
//     catch { return []; }
// };

export const CommandPalette = () => {
  if (stryMutAct_9fa48("899")) {
    {}
  } else {
    stryCov_9fa48("899");
    const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("900") ? true : (stryCov_9fa48("900"), false));
    const [query, setQuery] = useState(stryMutAct_9fa48("901") ? "Stryker was here!" : (stryCov_9fa48("901"), ''));
    const [selectedIndex, setSelectedIndex] = useState(0);
    const {
      navigateTo
    } = useApp();
    const {
      accounts
    } = useFinance();
    const {
      tasks
    } = useTasks();
    const inputRef = useRef<HTMLInputElement>(null);

    // Toggle Logic
    useEffect(() => {
      if (stryMutAct_9fa48("902")) {
        {}
      } else {
        stryCov_9fa48("902");
        const handleKeyDown = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("903")) {
            {}
          } else {
            stryCov_9fa48("903");
            if (stryMutAct_9fa48("906") ? e.metaKey || e.ctrlKey || e.key.toLowerCase() === 'k' : stryMutAct_9fa48("905") ? false : stryMutAct_9fa48("904") ? true : (stryCov_9fa48("904", "905", "906"), (stryMutAct_9fa48("908") ? e.metaKey && e.ctrlKey : stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907", "908"), e.metaKey || e.ctrlKey)) && (stryMutAct_9fa48("910") ? e.key.toLowerCase() !== 'k' : stryMutAct_9fa48("909") ? true : (stryCov_9fa48("909", "910"), (stryMutAct_9fa48("911") ? e.key.toUpperCase() : (stryCov_9fa48("911"), e.key.toLowerCase())) === (stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), 'k')))))) {
              if (stryMutAct_9fa48("913")) {
                {}
              } else {
                stryCov_9fa48("913");
                e.preventDefault();
                setIsOpen(stryMutAct_9fa48("914") ? () => undefined : (stryCov_9fa48("914"), prev => stryMutAct_9fa48("915") ? prev : (stryCov_9fa48("915"), !prev)));
              }
            }
            if (stryMutAct_9fa48("918") ? e.key !== 'Escape' : stryMutAct_9fa48("917") ? false : stryMutAct_9fa48("916") ? true : (stryCov_9fa48("916", "917", "918"), e.key === (stryMutAct_9fa48("919") ? "" : (stryCov_9fa48("919"), 'Escape')))) {
              if (stryMutAct_9fa48("920")) {
                {}
              } else {
                stryCov_9fa48("920");
                setIsOpen(stryMutAct_9fa48("921") ? true : (stryCov_9fa48("921"), false));
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("922") ? "" : (stryCov_9fa48("922"), 'keydown'), handleKeyDown);
        return stryMutAct_9fa48("923") ? () => undefined : (stryCov_9fa48("923"), () => window.removeEventListener(stryMutAct_9fa48("924") ? "" : (stryCov_9fa48("924"), 'keydown'), handleKeyDown));
      }
    }, stryMutAct_9fa48("925") ? ["Stryker was here"] : (stryCov_9fa48("925"), []));

    // Build results with actions and recent
    const results = useMemo<CommandResult[]>(() => {
      if (stryMutAct_9fa48("926")) {
        {}
      } else {
        stryCov_9fa48("926");
        const baseResults: CommandResult[] = stryMutAct_9fa48("927") ? [] : (stryCov_9fa48("927"), [// Actions (Quick access) - navigate to page
        stryMutAct_9fa48("928") ? {} : (stryCov_9fa48("928"), {
          id: stryMutAct_9fa48("929") ? "" : (stryCov_9fa48("929"), 'action-expense'),
          title: stryMutAct_9fa48("930") ? "" : (stryCov_9fa48("930"), 'Add Expense'),
          type: stryMutAct_9fa48("931") ? "" : (stryCov_9fa48("931"), 'Actions'),
          icon: MinusCircle,
          action: stryMutAct_9fa48("932") ? () => undefined : (stryCov_9fa48("932"), () => navigateTo(stryMutAct_9fa48("933") ? "" : (stryCov_9fa48("933"), 'finance')))
        }), stryMutAct_9fa48("934") ? {} : (stryCov_9fa48("934"), {
          id: stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), 'action-income'),
          title: stryMutAct_9fa48("936") ? "" : (stryCov_9fa48("936"), 'Add Income'),
          type: stryMutAct_9fa48("937") ? "" : (stryCov_9fa48("937"), 'Actions'),
          icon: PlusCircle,
          action: stryMutAct_9fa48("938") ? () => undefined : (stryCov_9fa48("938"), () => navigateTo(stryMutAct_9fa48("939") ? "" : (stryCov_9fa48("939"), 'finance')))
        }), stryMutAct_9fa48("940") ? {} : (stryCov_9fa48("940"), {
          id: stryMutAct_9fa48("941") ? "" : (stryCov_9fa48("941"), 'action-commitment'),
          title: stryMutAct_9fa48("942") ? "" : (stryCov_9fa48("942"), 'New Commitment'),
          type: stryMutAct_9fa48("943") ? "" : (stryCov_9fa48("943"), 'Actions'),
          icon: Plus,
          action: stryMutAct_9fa48("944") ? () => undefined : (stryCov_9fa48("944"), () => navigateTo(stryMutAct_9fa48("945") ? "" : (stryCov_9fa48("945"), 'commitments')))
        }), // Navigation
        stryMutAct_9fa48("946") ? {} : (stryCov_9fa48("946"), {
          id: stryMutAct_9fa48("947") ? "" : (stryCov_9fa48("947"), 'nav-dashboard'),
          title: stryMutAct_9fa48("948") ? "" : (stryCov_9fa48("948"), 'Go to Dashboard'),
          type: stryMutAct_9fa48("949") ? "" : (stryCov_9fa48("949"), 'Pages'),
          icon: LayoutDashboard,
          action: stryMutAct_9fa48("950") ? () => undefined : (stryCov_9fa48("950"), () => navigateTo(stryMutAct_9fa48("951") ? "" : (stryCov_9fa48("951"), 'dashboard')))
        }), stryMutAct_9fa48("952") ? {} : (stryCov_9fa48("952"), {
          id: stryMutAct_9fa48("953") ? "" : (stryCov_9fa48("953"), 'nav-commitments'),
          title: stryMutAct_9fa48("954") ? "" : (stryCov_9fa48("954"), 'Go to Commitments'),
          type: stryMutAct_9fa48("955") ? "" : (stryCov_9fa48("955"), 'Pages'),
          icon: CheckCircle2,
          action: stryMutAct_9fa48("956") ? () => undefined : (stryCov_9fa48("956"), () => navigateTo(stryMutAct_9fa48("957") ? "" : (stryCov_9fa48("957"), 'commitments')))
        }), stryMutAct_9fa48("958") ? {} : (stryCov_9fa48("958"), {
          id: stryMutAct_9fa48("959") ? "" : (stryCov_9fa48("959"), 'nav-finance'),
          title: stryMutAct_9fa48("960") ? "" : (stryCov_9fa48("960"), 'Go to Finance'),
          type: stryMutAct_9fa48("961") ? "" : (stryCov_9fa48("961"), 'Pages'),
          icon: CreditCard,
          action: stryMutAct_9fa48("962") ? () => undefined : (stryCov_9fa48("962"), () => navigateTo(stryMutAct_9fa48("963") ? "" : (stryCov_9fa48("963"), 'finance')))
        }), stryMutAct_9fa48("964") ? {} : (stryCov_9fa48("964"), {
          id: stryMutAct_9fa48("965") ? "" : (stryCov_9fa48("965"), 'nav-settings'),
          title: stryMutAct_9fa48("966") ? "" : (stryCov_9fa48("966"), 'Go to Settings'),
          type: stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'Pages'),
          icon: Settings,
          action: stryMutAct_9fa48("968") ? () => undefined : (stryCov_9fa48("968"), () => navigateTo(stryMutAct_9fa48("969") ? "" : (stryCov_9fa48("969"), 'settings')))
        }),
        // Accounts
        ...(stryMutAct_9fa48("970") ? accounts.map(a => ({
          id: `acc-${a.id}`,
          title: a.name,
          type: 'Accounts',
          icon: Wallet,
          action: () => navigateTo('finance')
        })) : (stryCov_9fa48("970"), accounts.filter(stryMutAct_9fa48("971") ? () => undefined : (stryCov_9fa48("971"), a => stryMutAct_9fa48("972") ? a.isArchived : (stryCov_9fa48("972"), !a.isArchived))).map(stryMutAct_9fa48("973") ? () => undefined : (stryCov_9fa48("973"), a => stryMutAct_9fa48("974") ? {} : (stryCov_9fa48("974"), {
          id: stryMutAct_9fa48("975") ? `` : (stryCov_9fa48("975"), `acc-${a.id}`),
          title: a.name,
          type: stryMutAct_9fa48("976") ? "" : (stryCov_9fa48("976"), 'Accounts'),
          icon: Wallet,
          action: stryMutAct_9fa48("977") ? () => undefined : (stryCov_9fa48("977"), () => navigateTo(stryMutAct_9fa48("978") ? "" : (stryCov_9fa48("978"), 'finance')))
        }))))),
        // Tasks (Top 3 incomplete)
        ...(stryMutAct_9fa48("980") ? tasks.slice(0, 3).map(t => ({
          id: `task-${t.id}`,
          title: t.title,
          type: 'Tasks',
          icon: CheckCircle2,
          action: () => navigateTo('commitments')
        })) : stryMutAct_9fa48("979") ? tasks.filter(t => !t.completed).map(t => ({
          id: `task-${t.id}`,
          title: t.title,
          type: 'Tasks',
          icon: CheckCircle2,
          action: () => navigateTo('commitments')
        })) : (stryCov_9fa48("979", "980"), tasks.filter(stryMutAct_9fa48("981") ? () => undefined : (stryCov_9fa48("981"), t => stryMutAct_9fa48("982") ? t.completed : (stryCov_9fa48("982"), !t.completed))).slice(0, 3).map(stryMutAct_9fa48("983") ? () => undefined : (stryCov_9fa48("983"), t => stryMutAct_9fa48("984") ? {} : (stryCov_9fa48("984"), {
          id: stryMutAct_9fa48("985") ? `` : (stryCov_9fa48("985"), `task-${t.id}`),
          title: t.title,
          type: stryMutAct_9fa48("986") ? "" : (stryCov_9fa48("986"), 'Tasks'),
          icon: CheckCircle2,
          action: stryMutAct_9fa48("987") ? () => undefined : (stryCov_9fa48("987"), () => navigateTo(stryMutAct_9fa48("988") ? "" : (stryCov_9fa48("988"), 'commitments')))
        })))))]);

        // Filter by query
        return stryMutAct_9fa48("989") ? baseResults : (stryCov_9fa48("989"), baseResults.filter(stryMutAct_9fa48("990") ? () => undefined : (stryCov_9fa48("990"), item => stryMutAct_9fa48("993") ? item.title.toLowerCase().includes(query.toLowerCase()) && item.type.toLowerCase().includes(query.toLowerCase()) : stryMutAct_9fa48("992") ? false : stryMutAct_9fa48("991") ? true : (stryCov_9fa48("991", "992", "993"), (stryMutAct_9fa48("994") ? item.title.toUpperCase().includes(query.toLowerCase()) : (stryCov_9fa48("994"), item.title.toLowerCase().includes(stryMutAct_9fa48("995") ? query.toUpperCase() : (stryCov_9fa48("995"), query.toLowerCase())))) || (stryMutAct_9fa48("996") ? item.type.toUpperCase().includes(query.toLowerCase()) : (stryCov_9fa48("996"), item.type.toLowerCase().includes(stryMutAct_9fa48("997") ? query.toUpperCase() : (stryCov_9fa48("997"), query.toLowerCase()))))))));
      }
    }, stryMutAct_9fa48("998") ? [] : (stryCov_9fa48("998"), [accounts, tasks, query, navigateTo]));

    // Keyboard Nav - reset index when query changes
    const prevQueryRef = useRef(query);
    useEffect(() => {
      if (stryMutAct_9fa48("999")) {
        {}
      } else {
        stryCov_9fa48("999");
        if (stryMutAct_9fa48("1001") ? false : stryMutAct_9fa48("1000") ? true : (stryCov_9fa48("1000", "1001"), isOpen)) {
          if (stryMutAct_9fa48("1002")) {
            {}
          } else {
            stryCov_9fa48("1002");
            stryMutAct_9fa48("1003") ? inputRef.current.focus() : (stryCov_9fa48("1003"), inputRef.current?.focus());
            // Only reset index if query changed (not on initial open)
            if (stryMutAct_9fa48("1006") ? prevQueryRef.current === query : stryMutAct_9fa48("1005") ? false : stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004", "1005", "1006"), prevQueryRef.current !== query)) {
              if (stryMutAct_9fa48("1007")) {
                {}
              } else {
                stryCov_9fa48("1007");
                prevQueryRef.current = query;
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("1008") ? [] : (stryCov_9fa48("1008"), [isOpen, query]));
    const handleListKeyDown = (e: React.KeyboardEvent) => {
      if (stryMutAct_9fa48("1009")) {
        {}
      } else {
        stryCov_9fa48("1009");
        if (stryMutAct_9fa48("1012") ? e.key !== 'ArrowDown' : stryMutAct_9fa48("1011") ? false : stryMutAct_9fa48("1010") ? true : (stryCov_9fa48("1010", "1011", "1012"), e.key === (stryMutAct_9fa48("1013") ? "" : (stryCov_9fa48("1013"), 'ArrowDown')))) {
          if (stryMutAct_9fa48("1014")) {
            {}
          } else {
            stryCov_9fa48("1014");
            e.preventDefault();
            setSelectedIndex(stryMutAct_9fa48("1015") ? () => undefined : (stryCov_9fa48("1015"), prev => stryMutAct_9fa48("1016") ? Math.max(prev + 1, results.length - 1) : (stryCov_9fa48("1016"), Math.min(stryMutAct_9fa48("1017") ? prev - 1 : (stryCov_9fa48("1017"), prev + 1), stryMutAct_9fa48("1018") ? results.length + 1 : (stryCov_9fa48("1018"), results.length - 1)))));
          }
        } else if (stryMutAct_9fa48("1021") ? e.key !== 'ArrowUp' : stryMutAct_9fa48("1020") ? false : stryMutAct_9fa48("1019") ? true : (stryCov_9fa48("1019", "1020", "1021"), e.key === (stryMutAct_9fa48("1022") ? "" : (stryCov_9fa48("1022"), 'ArrowUp')))) {
          if (stryMutAct_9fa48("1023")) {
            {}
          } else {
            stryCov_9fa48("1023");
            e.preventDefault();
            setSelectedIndex(stryMutAct_9fa48("1024") ? () => undefined : (stryCov_9fa48("1024"), prev => stryMutAct_9fa48("1025") ? Math.min(prev - 1, 0) : (stryCov_9fa48("1025"), Math.max(stryMutAct_9fa48("1026") ? prev + 1 : (stryCov_9fa48("1026"), prev - 1), 0))));
          }
        } else if (stryMutAct_9fa48("1029") ? e.key !== 'Enter' : stryMutAct_9fa48("1028") ? false : stryMutAct_9fa48("1027") ? true : (stryCov_9fa48("1027", "1028", "1029"), e.key === (stryMutAct_9fa48("1030") ? "" : (stryCov_9fa48("1030"), 'Enter')))) {
          if (stryMutAct_9fa48("1031")) {
            {}
          } else {
            stryCov_9fa48("1031");
            e.preventDefault();
            if (stryMutAct_9fa48("1033") ? false : stryMutAct_9fa48("1032") ? true : (stryCov_9fa48("1032", "1033"), results[selectedIndex])) {
              if (stryMutAct_9fa48("1034")) {
                {}
              } else {
                stryCov_9fa48("1034");
                results[selectedIndex].action();
                setIsOpen(stryMutAct_9fa48("1035") ? true : (stryCov_9fa48("1035"), false));
                setQuery(stryMutAct_9fa48("1036") ? "Stryker was here!" : (stryCov_9fa48("1036"), ''));
              }
            }
          }
        }
      }
    };
    if (stryMutAct_9fa48("1039") ? false : stryMutAct_9fa48("1038") ? true : stryMutAct_9fa48("1037") ? isOpen : (stryCov_9fa48("1037", "1038", "1039"), !isOpen)) return null;
    return <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={stryMutAct_9fa48("1040") ? () => undefined : (stryCov_9fa48("1040"), () => setIsOpen(stryMutAct_9fa48("1041") ? true : (stryCov_9fa48("1041"), false)))} />

            {/* Search Modal */}
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input ref={inputRef} type="text" placeholder="Search queries, pages, or actions..." className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 h-8" value={query} onChange={stryMutAct_9fa48("1042") ? () => undefined : (stryCov_9fa48("1042"), e => setQuery(e.target.value))} onKeyDown={handleListKeyDown} autoFocus />
                    <div className="hidden sm:flex items-center gap-1">
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-1.5 py-0.5">ESC</span>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                    {(stryMutAct_9fa48("1045") ? results.length !== 0 : stryMutAct_9fa48("1044") ? false : stryMutAct_9fa48("1043") ? true : (stryCov_9fa48("1043", "1044", "1045"), results.length === 0)) ? <div className="p-8 text-center text-slate-500 text-sm">No results found.</div> : results.map((item, index) => {
            if (stryMutAct_9fa48("1046")) {
              {}
            } else {
              stryCov_9fa48("1046");
              const Icon = item.icon;
              const isSelected = stryMutAct_9fa48("1049") ? index !== selectedIndex : stryMutAct_9fa48("1048") ? false : stryMutAct_9fa48("1047") ? true : (stryCov_9fa48("1047", "1048", "1049"), index === selectedIndex);
              return <button key={item.id} onClick={() => {
                if (stryMutAct_9fa48("1050")) {
                  {}
                } else {
                  stryCov_9fa48("1050");
                  item.action();
                  setIsOpen(stryMutAct_9fa48("1051") ? true : (stryCov_9fa48("1051"), false));
                  setQuery(stryMutAct_9fa48("1052") ? "Stryker was here!" : (stryCov_9fa48("1052"), ''));
                }
              }} className={stryMutAct_9fa48("1053") ? `` : (stryCov_9fa48("1053"), `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected ? stryMutAct_9fa48("1054") ? "" : (stryCov_9fa48("1054"), 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300') : stryMutAct_9fa48("1055") ? "" : (stryCov_9fa48("1055"), 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50')}`)}>
                                    <Icon className={stryMutAct_9fa48("1056") ? `` : (stryCov_9fa48("1056"), `w-4 h-4 ${isSelected ? stryMutAct_9fa48("1057") ? "" : (stryCov_9fa48("1057"), 'text-primary-500') : stryMutAct_9fa48("1058") ? "" : (stryCov_9fa48("1058"), 'text-slate-400')}`)} />
                                    <span className="flex-1 text-left line-clamp-1 font-medium">{item.title}</span>
                                    {stryMutAct_9fa48("1061") ? isSelected || <ArrowRight className="w-3.5 h-3.5 opacity-50" /> : stryMutAct_9fa48("1060") ? false : stryMutAct_9fa48("1059") ? true : (stryCov_9fa48("1059", "1060", "1061"), isSelected && <ArrowRight className="w-3.5 h-3.5 opacity-50" />)}
                                </button>;
            }
          })}
                </div>

                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Select <kbd className="font-sans">↑↓</kbd></span>
                    <span>Open <kbd className="font-sans">↵</kbd></span>
                </div>
            </div>
        </div>;
  }
};