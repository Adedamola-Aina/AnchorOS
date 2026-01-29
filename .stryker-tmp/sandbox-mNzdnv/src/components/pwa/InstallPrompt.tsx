/**
 * InstallPrompt - PWA Install Banner
 * 
 * Shows a prompt to install the app on mobile devices.
 * Uses the beforeinstallprompt event on Android/Chrome.
 * Shows manual instructions on iOS Safari.
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
import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
}
export const InstallPrompt = () => {
  if (stryMutAct_9fa48("807")) {
    {}
  } else {
    stryCov_9fa48("807");
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(stryMutAct_9fa48("808") ? true : (stryCov_9fa48("808"), false));
    const [isIOS, setIsIOS] = useState(stryMutAct_9fa48("809") ? true : (stryCov_9fa48("809"), false));
    const {
      isMobile
    } = useResponsive();
    useEffect(() => {
      if (stryMutAct_9fa48("810")) {
        {}
      } else {
        stryCov_9fa48("810");
        // Check if already installed (standalone mode)
        const isStandalone = window.matchMedia(stryMutAct_9fa48("811") ? "" : (stryCov_9fa48("811"), '(display-mode: standalone)')).matches;
        if (stryMutAct_9fa48("813") ? false : stryMutAct_9fa48("812") ? true : (stryCov_9fa48("812", "813"), isStandalone)) return;

        // Check if dismissed this session
        const dismissed = sessionStorage.getItem(stryMutAct_9fa48("814") ? "" : (stryCov_9fa48("814"), 'pwa-prompt-dismissed'));
        if (stryMutAct_9fa48("816") ? false : stryMutAct_9fa48("815") ? true : (stryCov_9fa48("815", "816"), dismissed)) return;

        // Detect iOS
        const isIOSDevice = stryMutAct_9fa48("819") ? /iPad|iPhone|iPod/.test(navigator.userAgent) || !(window as unknown as {
          MSStream: unknown;
        }).MSStream : stryMutAct_9fa48("818") ? false : stryMutAct_9fa48("817") ? true : (stryCov_9fa48("817", "818", "819"), /iPad|iPhone|iPod/.test(navigator.userAgent) && (stryMutAct_9fa48("820") ? (window as unknown as {
          MSStream: unknown;
        }).MSStream : (stryCov_9fa48("820"), !(window as unknown as {
          MSStream: unknown;
        }).MSStream)));
        setIsIOS(isIOSDevice);

        // On iOS, show after a delay
        if (stryMutAct_9fa48("823") ? isIOSDevice || isMobile : stryMutAct_9fa48("822") ? false : stryMutAct_9fa48("821") ? true : (stryCov_9fa48("821", "822", "823"), isIOSDevice && isMobile)) {
          if (stryMutAct_9fa48("824")) {
            {}
          } else {
            stryCov_9fa48("824");
            const timer = setTimeout(stryMutAct_9fa48("825") ? () => undefined : (stryCov_9fa48("825"), () => setShowPrompt(stryMutAct_9fa48("826") ? false : (stryCov_9fa48("826"), true))), 3000);
            return stryMutAct_9fa48("827") ? () => undefined : (stryCov_9fa48("827"), () => clearTimeout(timer));
          }
        }

        // On Android/Chrome, listen for the install prompt
        const handler = (e: Event) => {
          if (stryMutAct_9fa48("828")) {
            {}
          } else {
            stryCov_9fa48("828");
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(stryMutAct_9fa48("829") ? () => undefined : (stryCov_9fa48("829"), () => setShowPrompt(stryMutAct_9fa48("830") ? false : (stryCov_9fa48("830"), true))), 2000);
          }
        };
        window.addEventListener(stryMutAct_9fa48("831") ? "" : (stryCov_9fa48("831"), 'beforeinstallprompt'), handler);
        return stryMutAct_9fa48("832") ? () => undefined : (stryCov_9fa48("832"), () => window.removeEventListener(stryMutAct_9fa48("833") ? "" : (stryCov_9fa48("833"), 'beforeinstallprompt'), handler));
      }
    }, stryMutAct_9fa48("834") ? [] : (stryCov_9fa48("834"), [isMobile]));
    const handleInstall = async () => {
      if (stryMutAct_9fa48("835")) {
        {}
      } else {
        stryCov_9fa48("835");
        if (stryMutAct_9fa48("838") ? false : stryMutAct_9fa48("837") ? true : stryMutAct_9fa48("836") ? deferredPrompt : (stryCov_9fa48("836", "837", "838"), !deferredPrompt)) return;
        deferredPrompt.prompt();
        const {
          outcome
        } = await deferredPrompt.userChoice;
        if (stryMutAct_9fa48("841") ? outcome !== 'accepted' : stryMutAct_9fa48("840") ? false : stryMutAct_9fa48("839") ? true : (stryCov_9fa48("839", "840", "841"), outcome === (stryMutAct_9fa48("842") ? "" : (stryCov_9fa48("842"), 'accepted')))) {
          if (stryMutAct_9fa48("843")) {
            {}
          } else {
            stryCov_9fa48("843");
            setShowPrompt(stryMutAct_9fa48("844") ? true : (stryCov_9fa48("844"), false));
          }
        }
        setDeferredPrompt(null);
      }
    };
    const handleDismiss = () => {
      if (stryMutAct_9fa48("845")) {
        {}
      } else {
        stryCov_9fa48("845");
        setShowPrompt(stryMutAct_9fa48("846") ? true : (stryCov_9fa48("846"), false));
        sessionStorage.setItem(stryMutAct_9fa48("847") ? "" : (stryCov_9fa48("847"), 'pwa-prompt-dismissed'), stryMutAct_9fa48("848") ? "" : (stryCov_9fa48("848"), 'true'));
      }
    };
    if (stryMutAct_9fa48("851") ? !showPrompt && !isMobile : stryMutAct_9fa48("850") ? false : stryMutAct_9fa48("849") ? true : (stryCov_9fa48("849", "850", "851"), (stryMutAct_9fa48("852") ? showPrompt : (stryCov_9fa48("852"), !showPrompt)) || (stryMutAct_9fa48("853") ? isMobile : (stryCov_9fa48("853"), !isMobile)))) return null;
    return <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Download className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                            Install Anchor
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {isIOS ? <>Tap <Share className="w-4 h-4 inline mx-0.5" /> then "Add to Home Screen"</> : stryMutAct_9fa48("854") ? "" : (stryCov_9fa48("854"), 'Add to your home screen for quick access')}
                        </p>
                    </div>

                    <button onClick={handleDismiss} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Dismiss">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {stryMutAct_9fa48("857") ? !isIOS || <button onClick={handleInstall} className="mt-3 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                        Install App
                    </button> : stryMutAct_9fa48("856") ? false : stryMutAct_9fa48("855") ? true : (stryCov_9fa48("855", "856", "857"), (stryMutAct_9fa48("858") ? isIOS : (stryCov_9fa48("858"), !isIOS)) && <button onClick={handleInstall} className="mt-3 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                        Install App
                    </button>)}
            </div>
        </div>;
  }
};
export default InstallPrompt;