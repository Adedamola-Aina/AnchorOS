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
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = stryMutAct_9fa48("1062") ? "" : (stryCov_9fa48("1062"), 'Confirm'),
  cancelLabel = stryMutAct_9fa48("1063") ? "" : (stryCov_9fa48("1063"), 'Cancel'),
  isDestructive = stryMutAct_9fa48("1064") ? true : (stryCov_9fa48("1064"), false)
}) => {
  if (stryMutAct_9fa48("1065")) {
    {}
  } else {
    stryCov_9fa48("1065");
    return <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className={stryMutAct_9fa48("1066") ? `` : (stryCov_9fa48("1066"), `p-3 rounded-full shrink-0 ${isDestructive ? stryMutAct_9fa48("1067") ? "" : (stryCov_9fa48("1067"), 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400') : stryMutAct_9fa48("1068") ? "" : (stryCov_9fa48("1068"), 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')}`)}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        {cancelLabel}
                    </button>
                    <button onClick={() => {
            if (stryMutAct_9fa48("1069")) {
              {}
            } else {
              stryCov_9fa48("1069");
              onConfirm();
              onClose();
            }
          }} className={stryMutAct_9fa48("1070") ? `` : (stryCov_9fa48("1070"), `px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 ${isDestructive ? stryMutAct_9fa48("1071") ? "" : (stryCov_9fa48("1071"), 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20') : stryMutAct_9fa48("1072") ? "" : (stryCov_9fa48("1072"), 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20')}`)}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>;
  }
};