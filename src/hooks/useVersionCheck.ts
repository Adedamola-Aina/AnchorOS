/**
 * useVersionCheck - Automatic version checking and cache busting
 * 
 * This hook periodically checks if a new version of the app is available.
 * When detected, it automatically refreshes the page to load the new version.
 * 
 * How it works:
 * 1. On build, Vite generates index.html with unique asset hashes
 * 2. Every 60 seconds, we fetch the latest index.html from the server
 * 3. If the asset hashes have changed, a new version is available
 * 4. We show a brief toast and auto-reload after 2 seconds
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
import { useEffect, useRef, useCallback } from 'react';
const CHECK_INTERVAL_MS = stryMutAct_9fa48("158") ? 60 / 1000 : (stryCov_9fa48("158"), 60 * 1000); // Check every 60 seconds
const RELOAD_DELAY_MS = 2000; // Show notification for 2 seconds before reload

// Extract the main JS bundle hash from HTML content
function extractBundleHash(html: string): string | null {
  if (stryMutAct_9fa48("159")) {
    {}
  } else {
    stryCov_9fa48("159");
    // Match the index-*.js file which has a unique hash per build
    const match = html.match(stryMutAct_9fa48("161") ? /assets\/index-([^a-zA-Z0-9]+)\.js/ : stryMutAct_9fa48("160") ? /assets\/index-([a-zA-Z0-9])\.js/ : (stryCov_9fa48("160", "161"), /assets\/index-([a-zA-Z0-9]+)\.js/));
    return match ? match[1] : null;
  }
}
export function useVersionCheck(enabled: boolean = stryMutAct_9fa48("162") ? false : (stryCov_9fa48("162"), true)) {
  if (stryMutAct_9fa48("163")) {
    {}
  } else {
    stryCov_9fa48("163");
    const currentHashRef = useRef<string | null>(null);
    const isCheckingRef = useRef(stryMutAct_9fa48("164") ? true : (stryCov_9fa48("164"), false));
    const checkForUpdate = useCallback(async () => {
      if (stryMutAct_9fa48("165")) {
        {}
      } else {
        stryCov_9fa48("165");
        if (stryMutAct_9fa48("167") ? false : stryMutAct_9fa48("166") ? true : (stryCov_9fa48("166", "167"), isCheckingRef.current)) return;
        isCheckingRef.current = stryMutAct_9fa48("168") ? false : (stryCov_9fa48("168"), true);
        try {
          if (stryMutAct_9fa48("169")) {
            {}
          } else {
            stryCov_9fa48("169");
            // Fetch the latest index.html with cache-busting
            const response = await fetch(stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), '/'), stryMutAct_9fa48("171") ? {} : (stryCov_9fa48("171"), {
              method: stryMutAct_9fa48("172") ? "" : (stryCov_9fa48("172"), 'GET'),
              headers: stryMutAct_9fa48("173") ? {} : (stryCov_9fa48("173"), {
                'Cache-Control': stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), 'no-cache, no-store, must-revalidate'),
                'Pragma': stryMutAct_9fa48("175") ? "" : (stryCov_9fa48("175"), 'no-cache')
              }),
              cache: stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), 'no-store')
            }));
            if (stryMutAct_9fa48("179") ? false : stryMutAct_9fa48("178") ? true : stryMutAct_9fa48("177") ? response.ok : (stryCov_9fa48("177", "178", "179"), !response.ok)) {
              if (stryMutAct_9fa48("180")) {
                {}
              } else {
                stryCov_9fa48("180");
                isCheckingRef.current = stryMutAct_9fa48("181") ? true : (stryCov_9fa48("181"), false);
                return;
              }
            }
            const html = await response.text();
            const latestHash = extractBundleHash(html);
            if (stryMutAct_9fa48("184") ? false : stryMutAct_9fa48("183") ? true : stryMutAct_9fa48("182") ? latestHash : (stryCov_9fa48("182", "183", "184"), !latestHash)) {
              if (stryMutAct_9fa48("185")) {
                {}
              } else {
                stryCov_9fa48("185");
                isCheckingRef.current = stryMutAct_9fa48("186") ? true : (stryCov_9fa48("186"), false);
                return;
              }
            }

            // First run - store the current hash
            if (stryMutAct_9fa48("189") ? currentHashRef.current !== null : stryMutAct_9fa48("188") ? false : stryMutAct_9fa48("187") ? true : (stryCov_9fa48("187", "188", "189"), currentHashRef.current === null)) {
              if (stryMutAct_9fa48("190")) {
                {}
              } else {
                stryCov_9fa48("190");
                currentHashRef.current = latestHash;
                isCheckingRef.current = stryMutAct_9fa48("191") ? true : (stryCov_9fa48("191"), false);
                return;
              }
            }

            // Check if hash has changed
            if (stryMutAct_9fa48("194") ? latestHash === currentHashRef.current : stryMutAct_9fa48("193") ? false : stryMutAct_9fa48("192") ? true : (stryCov_9fa48("192", "193", "194"), latestHash !== currentHashRef.current)) {
              if (stryMutAct_9fa48("195")) {
                {}
              } else {
                stryCov_9fa48("195");
                if (stryMutAct_9fa48("197") ? false : stryMutAct_9fa48("196") ? true : (stryCov_9fa48("196", "197"), import.meta.env.DEV)) console.info(stryMutAct_9fa48("198") ? "" : (stryCov_9fa48("198"), '[VersionCheck] New version detected! Reloading...'));

                // Brief notification before reload
                const toast = document.createElement(stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), 'div'));
                toast.className = stryMutAct_9fa48("200") ? "" : (stryCov_9fa48("200"), 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg z-[9999] animate-pulse font-bold text-sm');
                toast.textContent = stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), '🚀 New version available! Refreshing...');
                document.body.appendChild(toast);

                // Reload after brief delay
                setTimeout(() => {
                  if (stryMutAct_9fa48("202")) {
                    {}
                  } else {
                    stryCov_9fa48("202");
                    window.location.reload();
                  }
                }, RELOAD_DELAY_MS);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("203")) {
            {}
          } else {
            stryCov_9fa48("203");
            // Silently fail - network issues shouldn't break the app
            console.debug(stryMutAct_9fa48("204") ? "" : (stryCov_9fa48("204"), '[VersionCheck] Check failed:'), error);
          }
        } finally {
          if (stryMutAct_9fa48("205")) {
            {}
          } else {
            stryCov_9fa48("205");
            isCheckingRef.current = stryMutAct_9fa48("206") ? true : (stryCov_9fa48("206"), false);
          }
        }
      }
    }, stryMutAct_9fa48("207") ? ["Stryker was here"] : (stryCov_9fa48("207"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("208")) {
        {}
      } else {
        stryCov_9fa48("208");
        if (stryMutAct_9fa48("211") ? false : stryMutAct_9fa48("210") ? true : stryMutAct_9fa48("209") ? enabled : (stryCov_9fa48("209", "210", "211"), !enabled)) return;

        // Only run on deployed environments (dev, staging, production Firebase hosting)
        // Skip if running locally via Vite dev server (localhost or Tailscale)
        const isLocalhost = stryMutAct_9fa48("214") ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')) && window.location.hostname.startsWith('100.') : stryMutAct_9fa48("213") ? false : stryMutAct_9fa48("212") ? true : (stryCov_9fa48("212", "213", "214"), (stryMutAct_9fa48("216") ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.hostname.startsWith('192.168.') : stryMutAct_9fa48("215") ? false : (stryCov_9fa48("215", "216"), (stryMutAct_9fa48("218") ? window.location.hostname === 'localhost' && window.location.hostname === '127.0.0.1' : stryMutAct_9fa48("217") ? false : (stryCov_9fa48("217", "218"), (stryMutAct_9fa48("220") ? window.location.hostname !== 'localhost' : stryMutAct_9fa48("219") ? false : (stryCov_9fa48("219", "220"), window.location.hostname === (stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), 'localhost')))) || (stryMutAct_9fa48("223") ? window.location.hostname !== '127.0.0.1' : stryMutAct_9fa48("222") ? false : (stryCov_9fa48("222", "223"), window.location.hostname === (stryMutAct_9fa48("224") ? "" : (stryCov_9fa48("224"), '127.0.0.1')))))) || (stryMutAct_9fa48("225") ? window.location.hostname.endsWith('192.168.') : (stryCov_9fa48("225"), window.location.hostname.startsWith(stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), '192.168.')))))) || (stryMutAct_9fa48("227") ? window.location.hostname.endsWith('100.') : (stryCov_9fa48("227"), window.location.hostname.startsWith(stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), '100.'))))); // Tailscale IPs

        if (stryMutAct_9fa48("230") ? false : stryMutAct_9fa48("229") ? true : (stryCov_9fa48("229", "230"), isLocalhost)) {
          if (stryMutAct_9fa48("231")) {
            {}
          } else {
            stryCov_9fa48("231");
            console.debug(stryMutAct_9fa48("232") ? "" : (stryCov_9fa48("232"), '[VersionCheck] Disabled for local development'));
            return;
          }
        }

        // Initial check after 5 seconds (to not block initial load)
        const initialTimeout = setTimeout(checkForUpdate, 5000);

        // Periodic checks
        const interval = setInterval(checkForUpdate, CHECK_INTERVAL_MS);

        // Also check when tab becomes visible (user returns to app)
        const handleVisibilityChange = () => {
          if (stryMutAct_9fa48("233")) {
            {}
          } else {
            stryCov_9fa48("233");
            if (stryMutAct_9fa48("236") ? document.visibilityState !== 'visible' : stryMutAct_9fa48("235") ? false : stryMutAct_9fa48("234") ? true : (stryCov_9fa48("234", "235", "236"), document.visibilityState === (stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), 'visible')))) {
              if (stryMutAct_9fa48("238")) {
                {}
              } else {
                stryCov_9fa48("238");
                checkForUpdate();
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("239") ? "" : (stryCov_9fa48("239"), 'visibilitychange'), handleVisibilityChange);
        return () => {
          if (stryMutAct_9fa48("240")) {
            {}
          } else {
            stryCov_9fa48("240");
            clearTimeout(initialTimeout);
            clearInterval(interval);
            document.removeEventListener(stryMutAct_9fa48("241") ? "" : (stryCov_9fa48("241"), 'visibilitychange'), handleVisibilityChange);
          }
        };
      }
    }, stryMutAct_9fa48("242") ? [] : (stryCov_9fa48("242"), [enabled, checkForUpdate]));
  }
}