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
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  /** If true, modal takes full screen on mobile devices (default: true) */
  fullScreenMobile?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = stryMutAct_9fa48("1253") ? "" : (stryCov_9fa48("1253"), 'max-w-lg'),
  fullScreenMobile = stryMutAct_9fa48("1254") ? false : (stryCov_9fa48("1254"), true)
}) => {
  if (stryMutAct_9fa48("1255")) {
    {}
  } else {
    stryCov_9fa48("1255");
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    // Use React.useId for stable SSR-compatible unique IDs
    const modalId = React.useId();

    // Focus trap and keyboard handling
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (stryMutAct_9fa48("1256")) {
        {}
      } else {
        stryCov_9fa48("1256");
        if (stryMutAct_9fa48("1259") ? e.key !== 'Escape' : stryMutAct_9fa48("1258") ? false : stryMutAct_9fa48("1257") ? true : (stryCov_9fa48("1257", "1258", "1259"), e.key === (stryMutAct_9fa48("1260") ? "" : (stryCov_9fa48("1260"), 'Escape')))) {
          if (stryMutAct_9fa48("1261")) {
            {}
          } else {
            stryCov_9fa48("1261");
            onClose();
            return;
          }
        }

        // Focus trap
        if (stryMutAct_9fa48("1264") ? e.key === 'Tab' || modalRef.current : stryMutAct_9fa48("1263") ? false : stryMutAct_9fa48("1262") ? true : (stryCov_9fa48("1262", "1263", "1264"), (stryMutAct_9fa48("1266") ? e.key !== 'Tab' : stryMutAct_9fa48("1265") ? true : (stryCov_9fa48("1265", "1266"), e.key === (stryMutAct_9fa48("1267") ? "" : (stryCov_9fa48("1267"), 'Tab')))) && modalRef.current)) {
          if (stryMutAct_9fa48("1268")) {
            {}
          } else {
            stryCov_9fa48("1268");
            const focusableElements = modalRef.current.querySelectorAll(stryMutAct_9fa48("1269") ? "" : (stryCov_9fa48("1269"), 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            if (stryMutAct_9fa48("1272") ? e.shiftKey || document.activeElement === firstElement : stryMutAct_9fa48("1271") ? false : stryMutAct_9fa48("1270") ? true : (stryCov_9fa48("1270", "1271", "1272"), e.shiftKey && (stryMutAct_9fa48("1274") ? document.activeElement !== firstElement : stryMutAct_9fa48("1273") ? true : (stryCov_9fa48("1273", "1274"), document.activeElement === firstElement)))) {
              if (stryMutAct_9fa48("1275")) {
                {}
              } else {
                stryCov_9fa48("1275");
                e.preventDefault();
                stryMutAct_9fa48("1276") ? lastElement.focus() : (stryCov_9fa48("1276"), lastElement?.focus());
              }
            } else if (stryMutAct_9fa48("1279") ? !e.shiftKey || document.activeElement === lastElement : stryMutAct_9fa48("1278") ? false : stryMutAct_9fa48("1277") ? true : (stryCov_9fa48("1277", "1278", "1279"), (stryMutAct_9fa48("1280") ? e.shiftKey : (stryCov_9fa48("1280"), !e.shiftKey)) && (stryMutAct_9fa48("1282") ? document.activeElement !== lastElement : stryMutAct_9fa48("1281") ? true : (stryCov_9fa48("1281", "1282"), document.activeElement === lastElement)))) {
              if (stryMutAct_9fa48("1283")) {
                {}
              } else {
                stryCov_9fa48("1283");
                e.preventDefault();
                stryMutAct_9fa48("1284") ? firstElement.focus() : (stryCov_9fa48("1284"), firstElement?.focus());
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("1285") ? [] : (stryCov_9fa48("1285"), [onClose]));
    useEffect(() => {
      if (stryMutAct_9fa48("1286")) {
        {}
      } else {
        stryCov_9fa48("1286");
        if (stryMutAct_9fa48("1288") ? false : stryMutAct_9fa48("1287") ? true : (stryCov_9fa48("1287", "1288"), isOpen)) {
          if (stryMutAct_9fa48("1289")) {
            {}
          } else {
            stryCov_9fa48("1289");
            // Store previous active element
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.body.style.overflow = stryMutAct_9fa48("1290") ? "" : (stryCov_9fa48("1290"), 'hidden');
            document.addEventListener(stryMutAct_9fa48("1291") ? "" : (stryCov_9fa48("1291"), 'keydown'), handleKeyDown);

            // Focus first focusable element in modal
            setTimeout(() => {
              if (stryMutAct_9fa48("1292")) {
                {}
              } else {
                stryCov_9fa48("1292");
                const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
                stryMutAct_9fa48("1293") ? firstFocusable.focus() : (stryCov_9fa48("1293"), firstFocusable?.focus());
              }
            }, 0);
          }
        } else {
          if (stryMutAct_9fa48("1294")) {
            {}
          } else {
            stryCov_9fa48("1294");
            document.body.style.overflow = stryMutAct_9fa48("1295") ? "" : (stryCov_9fa48("1295"), 'unset');
            document.removeEventListener(stryMutAct_9fa48("1296") ? "" : (stryCov_9fa48("1296"), 'keydown'), handleKeyDown);

            // Restore focus to previous element
            stryMutAct_9fa48("1297") ? previousActiveElement.current.focus() : (stryCov_9fa48("1297"), previousActiveElement.current?.focus());
          }
        }
        return () => {
          if (stryMutAct_9fa48("1298")) {
            {}
          } else {
            stryCov_9fa48("1298");
            document.body.style.overflow = stryMutAct_9fa48("1299") ? "" : (stryCov_9fa48("1299"), 'unset');
            document.removeEventListener(stryMutAct_9fa48("1300") ? "" : (stryCov_9fa48("1300"), 'keydown'), handleKeyDown);
          }
        };
      }
    }, stryMutAct_9fa48("1301") ? [] : (stryCov_9fa48("1301"), [isOpen, handleKeyDown]));
    if (stryMutAct_9fa48("1304") ? false : stryMutAct_9fa48("1303") ? true : stryMutAct_9fa48("1302") ? isOpen : (stryCov_9fa48("1302", "1303", "1304"), !isOpen)) return null;
    return createPortal(<div className={stryMutAct_9fa48("1305") ? `` : (stryCov_9fa48("1305"), `fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 ${fullScreenMobile ? stryMutAct_9fa48("1306") ? "" : (stryCov_9fa48("1306"), 'p-0 sm:p-6') : stryMutAct_9fa48("1307") ? "" : (stryCov_9fa48("1307"), 'p-4 sm:p-6')}`)} role="dialog" aria-modal="true" aria-labelledby={title ? modalId : undefined}>
            {/* Backdrop */}
            <div className="fixed inset-0 transition-opacity" onClick={onClose} aria-hidden="true" />

            {/* Content - Full screen on mobile, centered modal on desktop */}
            <div ref={modalRef} className={stryMutAct_9fa48("1308") ? `` : (stryCov_9fa48("1308"), `relative z-10 bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden ${fullScreenMobile ? stryMutAct_9fa48("1309") ? `` : (stryCov_9fa48("1309"), `w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:${maxWidth} sm:rounded-2xl`) : stryMutAct_9fa48("1310") ? `` : (stryCov_9fa48("1310"), `w-full ${maxWidth} max-h-[90vh] rounded-2xl`)}`)}>
                {/* Header - with safe area padding on mobile */}
                <div className={stryMutAct_9fa48("1311") ? `` : (stryCov_9fa48("1311"), `px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0 ${fullScreenMobile ? stryMutAct_9fa48("1312") ? "" : (stryCov_9fa48("1312"), 'pt-safe') : stryMutAct_9fa48("1313") ? "Stryker was here!" : (stryCov_9fa48("1313"), '')}`)}>
                    <h3 id={modalId} className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" aria-label="Close modal">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body - with safe area padding on mobile */}
                <div className={stryMutAct_9fa48("1314") ? `` : (stryCov_9fa48("1314"), `p-6 overflow-y-auto flex-1 ${fullScreenMobile ? stryMutAct_9fa48("1315") ? "" : (stryCov_9fa48("1315"), 'pb-safe') : stryMutAct_9fa48("1316") ? "Stryker was here!" : (stryCov_9fa48("1316"), '')}`)}>
                    {children}
                </div>
            </div>
        </div>, document.body);
  }
};