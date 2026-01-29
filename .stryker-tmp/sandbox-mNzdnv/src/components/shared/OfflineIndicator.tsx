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
import { Wifi, WifiOff } from 'lucide-react';
export const OfflineIndicator = () => {
  if (stryMutAct_9fa48("1317")) {
    {}
  } else {
    stryCov_9fa48("1317");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [show, setShow] = useState(stryMutAct_9fa48("1318") ? true : (stryCov_9fa48("1318"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("1319")) {
        {}
      } else {
        stryCov_9fa48("1319");
        const handleOnline = () => {
          if (stryMutAct_9fa48("1320")) {
            {}
          } else {
            stryCov_9fa48("1320");
            setIsOnline(stryMutAct_9fa48("1321") ? false : (stryCov_9fa48("1321"), true));
            setShow(stryMutAct_9fa48("1322") ? false : (stryCov_9fa48("1322"), true));
            // Hide the "Back Online" message after 3 seconds
            setTimeout(stryMutAct_9fa48("1323") ? () => undefined : (stryCov_9fa48("1323"), () => setShow(stryMutAct_9fa48("1324") ? true : (stryCov_9fa48("1324"), false))), 3000);
          }
        };
        const handleOffline = () => {
          if (stryMutAct_9fa48("1325")) {
            {}
          } else {
            stryCov_9fa48("1325");
            setIsOnline(stryMutAct_9fa48("1326") ? true : (stryCov_9fa48("1326"), false));
            setShow(stryMutAct_9fa48("1327") ? false : (stryCov_9fa48("1327"), true));
          }
        };
        window.addEventListener(stryMutAct_9fa48("1328") ? "" : (stryCov_9fa48("1328"), 'online'), handleOnline);
        window.addEventListener(stryMutAct_9fa48("1329") ? "" : (stryCov_9fa48("1329"), 'offline'), handleOffline);
        return () => {
          if (stryMutAct_9fa48("1330")) {
            {}
          } else {
            stryCov_9fa48("1330");
            window.removeEventListener(stryMutAct_9fa48("1331") ? "" : (stryCov_9fa48("1331"), 'online'), handleOnline);
            window.removeEventListener(stryMutAct_9fa48("1332") ? "" : (stryCov_9fa48("1332"), 'offline'), handleOffline);
          }
        };
      }
    }, stryMutAct_9fa48("1333") ? ["Stryker was here"] : (stryCov_9fa48("1333"), []));
    if (stryMutAct_9fa48("1336") ? !show || isOnline : stryMutAct_9fa48("1335") ? false : stryMutAct_9fa48("1334") ? true : (stryCov_9fa48("1334", "1335", "1336"), (stryMutAct_9fa48("1337") ? show : (stryCov_9fa48("1337"), !show)) && isOnline)) return null;
    return <div className={stryMutAct_9fa48("1338") ? `` : (stryCov_9fa48("1338"), `fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-2xl transition-all duration-500 animate-in slide-in-from-bottom-4 ${isOnline ? stryMutAct_9fa48("1339") ? "" : (stryCov_9fa48("1339"), 'bg-emerald-500 text-white') : stryMutAct_9fa48("1340") ? "" : (stryCov_9fa48("1340"), 'bg-slate-900 dark:bg-slate-800 text-white')}`)}>
            {isOnline ? <>
                    <Wifi className="w-4 h-4" />
                    <span>Back Online</span>
                </> : <>
                    <WifiOff className="w-4 h-4 animate-pulse" />
                    <span>Offline Mode</span>
                </>}
        </div>;
  }
};