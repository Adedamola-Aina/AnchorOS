/**
 * KeyboardShortcutsHelp
 * 
 * Modal component showing all available keyboard shortcuts.
 * Accessible via Settings or pressing "?" key.
 * 
 * @example
 * <KeyboardShortcutsHelp isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Modal } from './Modal';
interface Shortcut {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Actions' | 'Views';
}
const SHORTCUTS: Shortcut[] = stryMutAct_9fa48("1185") ? [] : (stryCov_9fa48("1185"), [// Navigation
stryMutAct_9fa48("1186") ? {} : (stryCov_9fa48("1186"), {
  keys: stryMutAct_9fa48("1187") ? [] : (stryCov_9fa48("1187"), [stryMutAct_9fa48("1188") ? "" : (stryCov_9fa48("1188"), '⌘/Ctrl'), stryMutAct_9fa48("1189") ? "" : (stryCov_9fa48("1189"), 'K')]),
  description: stryMutAct_9fa48("1190") ? "" : (stryCov_9fa48("1190"), 'Open Command Palette'),
  category: stryMutAct_9fa48("1191") ? "" : (stryCov_9fa48("1191"), 'Navigation')
}), stryMutAct_9fa48("1192") ? {} : (stryCov_9fa48("1192"), {
  keys: stryMutAct_9fa48("1193") ? [] : (stryCov_9fa48("1193"), [stryMutAct_9fa48("1194") ? "" : (stryCov_9fa48("1194"), 'Esc')]),
  description: stryMutAct_9fa48("1195") ? "" : (stryCov_9fa48("1195"), 'Close modal / Cancel'),
  category: stryMutAct_9fa48("1196") ? "" : (stryCov_9fa48("1196"), 'Navigation')
}), // Actions
stryMutAct_9fa48("1197") ? {} : (stryCov_9fa48("1197"), {
  keys: stryMutAct_9fa48("1198") ? [] : (stryCov_9fa48("1198"), [stryMutAct_9fa48("1199") ? "" : (stryCov_9fa48("1199"), '/')]),
  description: stryMutAct_9fa48("1200") ? "" : (stryCov_9fa48("1200"), 'Focus search (in Finance)'),
  category: stryMutAct_9fa48("1201") ? "" : (stryCov_9fa48("1201"), 'Actions')
}), stryMutAct_9fa48("1202") ? {} : (stryCov_9fa48("1202"), {
  keys: stryMutAct_9fa48("1203") ? [] : (stryCov_9fa48("1203"), [stryMutAct_9fa48("1204") ? "" : (stryCov_9fa48("1204"), 'N')]),
  description: stryMutAct_9fa48("1205") ? "" : (stryCov_9fa48("1205"), 'New transaction (in Finance)'),
  category: stryMutAct_9fa48("1206") ? "" : (stryCov_9fa48("1206"), 'Actions')
}), stryMutAct_9fa48("1207") ? {} : (stryCov_9fa48("1207"), {
  keys: stryMutAct_9fa48("1208") ? [] : (stryCov_9fa48("1208"), [stryMutAct_9fa48("1209") ? "" : (stryCov_9fa48("1209"), '?')]),
  description: stryMutAct_9fa48("1210") ? "" : (stryCov_9fa48("1210"), 'Show keyboard shortcuts'),
  category: stryMutAct_9fa48("1211") ? "" : (stryCov_9fa48("1211"), 'Actions')
}), // Views
stryMutAct_9fa48("1212") ? {} : (stryCov_9fa48("1212"), {
  keys: stryMutAct_9fa48("1213") ? [] : (stryCov_9fa48("1213"), [stryMutAct_9fa48("1214") ? "" : (stryCov_9fa48("1214"), 'G'), stryMutAct_9fa48("1215") ? "" : (stryCov_9fa48("1215"), 'D')]),
  description: stryMutAct_9fa48("1216") ? "" : (stryCov_9fa48("1216"), 'Go to Dashboard'),
  category: stryMutAct_9fa48("1217") ? "" : (stryCov_9fa48("1217"), 'Views')
}), stryMutAct_9fa48("1218") ? {} : (stryCov_9fa48("1218"), {
  keys: stryMutAct_9fa48("1219") ? [] : (stryCov_9fa48("1219"), [stryMutAct_9fa48("1220") ? "" : (stryCov_9fa48("1220"), 'G'), stryMutAct_9fa48("1221") ? "" : (stryCov_9fa48("1221"), 'F')]),
  description: stryMutAct_9fa48("1222") ? "" : (stryCov_9fa48("1222"), 'Go to Finance'),
  category: stryMutAct_9fa48("1223") ? "" : (stryCov_9fa48("1223"), 'Views')
}), stryMutAct_9fa48("1224") ? {} : (stryCov_9fa48("1224"), {
  keys: stryMutAct_9fa48("1225") ? [] : (stryCov_9fa48("1225"), [stryMutAct_9fa48("1226") ? "" : (stryCov_9fa48("1226"), 'G'), stryMutAct_9fa48("1227") ? "" : (stryCov_9fa48("1227"), 'C')]),
  description: stryMutAct_9fa48("1228") ? "" : (stryCov_9fa48("1228"), 'Go to Commitments'),
  category: stryMutAct_9fa48("1229") ? "" : (stryCov_9fa48("1229"), 'Views')
}), stryMutAct_9fa48("1230") ? {} : (stryCov_9fa48("1230"), {
  keys: stryMutAct_9fa48("1231") ? [] : (stryCov_9fa48("1231"), [stryMutAct_9fa48("1232") ? "" : (stryCov_9fa48("1232"), 'G'), stryMutAct_9fa48("1233") ? "" : (stryCov_9fa48("1233"), 'S')]),
  description: stryMutAct_9fa48("1234") ? "" : (stryCov_9fa48("1234"), 'Go to Settings'),
  category: stryMutAct_9fa48("1235") ? "" : (stryCov_9fa48("1235"), 'Views')
})]);
interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}
const KeyBadge: React.FC<{
  children: React.ReactNode;
}> = stryMutAct_9fa48("1236") ? () => undefined : (stryCov_9fa48("1236"), (() => {
  const KeyBadge: React.FC<{
    children: React.ReactNode;
  }> = ({
    children
  }) => <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm">
        {children}
    </kbd>;
  return KeyBadge;
})());
export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose
}) => {
  if (stryMutAct_9fa48("1237")) {
    {}
  } else {
    stryCov_9fa48("1237");
    const categories = ['Navigation', 'Actions', 'Views'] as const;
    return <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                            <Keyboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Keyboard Shortcuts
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label="Close">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {categories.map(stryMutAct_9fa48("1238") ? () => undefined : (stryCov_9fa48("1238"), category => <div key={category} className="mb-6 last:mb-0">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {stryMutAct_9fa48("1239") ? SHORTCUTS.map((shortcut, i) => <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, ki) => <React.Fragment key={ki}>
                                                    <KeyBadge>{key}</KeyBadge>
                                                    {ki < shortcut.keys.length - 1 && <span className="text-slate-400 text-xs">+</span>}
                                                </React.Fragment>)}
                                        </div>
                                    </div>) : (stryCov_9fa48("1239"), SHORTCUTS.filter(stryMutAct_9fa48("1240") ? () => undefined : (stryCov_9fa48("1240"), s => stryMutAct_9fa48("1243") ? s.category !== category : stryMutAct_9fa48("1242") ? false : stryMutAct_9fa48("1241") ? true : (stryCov_9fa48("1241", "1242", "1243"), s.category === category))).map(stryMutAct_9fa48("1244") ? () => undefined : (stryCov_9fa48("1244"), (shortcut, i) => <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map(stryMutAct_9fa48("1245") ? () => undefined : (stryCov_9fa48("1245"), (key, ki) => <React.Fragment key={ki}>
                                                    <KeyBadge>{key}</KeyBadge>
                                                    {stryMutAct_9fa48("1248") ? ki < shortcut.keys.length - 1 || <span className="text-slate-400 text-xs">+</span> : stryMutAct_9fa48("1247") ? false : stryMutAct_9fa48("1246") ? true : (stryCov_9fa48("1246", "1247", "1248"), (stryMutAct_9fa48("1251") ? ki >= shortcut.keys.length - 1 : stryMutAct_9fa48("1250") ? ki <= shortcut.keys.length - 1 : stryMutAct_9fa48("1249") ? true : (stryCov_9fa48("1249", "1250", "1251"), ki < (stryMutAct_9fa48("1252") ? shortcut.keys.length + 1 : (stryCov_9fa48("1252"), shortcut.keys.length - 1)))) && <span className="text-slate-400 text-xs">+</span>)}
                                                </React.Fragment>))}
                                        </div>
                                    </div>)))}
                            </div>
                        </div>))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Press <KeyBadge>?</KeyBadge> anytime to show this help
                    </p>
                </div>
            </div>
        </Modal>;
  }
};