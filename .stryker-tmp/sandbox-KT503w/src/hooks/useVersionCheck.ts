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
const CHECK_INTERVAL_MS = stryMutAct_9fa48("7923") ? 60 / 1000 : (stryCov_9fa48("7923"), 60 * 1000); // Check every 60 seconds
const RELOAD_DELAY_MS = 2000; // Show notification for 2 seconds before reload

// Extract the main JS bundle hash from HTML content
function extractBundleHash(html: string): string | null {
  if (stryMutAct_9fa48("7924")) {
    {}
  } else {
    stryCov_9fa48("7924");
    // Match the index-*.js file which has a unique hash per build
    const match = html.match(stryMutAct_9fa48("7926") ? /assets\/index-([^a-zA-Z0-9]+)\.js/ : stryMutAct_9fa48("7925") ? /assets\/index-([a-zA-Z0-9])\.js/ : (stryCov_9fa48("7925", "7926"), /assets\/index-([a-zA-Z0-9]+)\.js/));
    return match ? match[1] : null;
  }
}
export function useVersionCheck(enabled: boolean = stryMutAct_9fa48("7927") ? false : (stryCov_9fa48("7927"), true)) {
  if (stryMutAct_9fa48("7928")) {
    {}
  } else {
    stryCov_9fa48("7928");
    const currentHashRef = useRef<string | null>(null);
    const isCheckingRef = useRef(stryMutAct_9fa48("7929") ? true : (stryCov_9fa48("7929"), false));
    const checkForUpdate = useCallback(async () => {
      if (stryMutAct_9fa48("7930")) {
        {}
      } else {
        stryCov_9fa48("7930");
        if (stryMutAct_9fa48("7932") ? false : stryMutAct_9fa48("7931") ? true : (stryCov_9fa48("7931", "7932"), isCheckingRef.current)) return;
        isCheckingRef.current = stryMutAct_9fa48("7933") ? false : (stryCov_9fa48("7933"), true);
        try {
          if (stryMutAct_9fa48("7934")) {
            {}
          } else {
            stryCov_9fa48("7934");
            // Fetch the latest index.html with cache-busting
            const response = await fetch(stryMutAct_9fa48("7935") ? "" : (stryCov_9fa48("7935"), '/'), stryMutAct_9fa48("7936") ? {} : (stryCov_9fa48("7936"), {
              method: stryMutAct_9fa48("7937") ? "" : (stryCov_9fa48("7937"), 'GET'),
              headers: stryMutAct_9fa48("7938") ? {} : (stryCov_9fa48("7938"), {
                'Cache-Control': stryMutAct_9fa48("7939") ? "" : (stryCov_9fa48("7939"), 'no-cache, no-store, must-revalidate'),
                'Pragma': stryMutAct_9fa48("7940") ? "" : (stryCov_9fa48("7940"), 'no-cache')
              }),
              cache: stryMutAct_9fa48("7941") ? "" : (stryCov_9fa48("7941"), 'no-store')
            }));
            if (stryMutAct_9fa48("7944") ? false : stryMutAct_9fa48("7943") ? true : stryMutAct_9fa48("7942") ? response.ok : (stryCov_9fa48("7942", "7943", "7944"), !response.ok)) {
              if (stryMutAct_9fa48("7945")) {
                {}
              } else {
                stryCov_9fa48("7945");
                isCheckingRef.current = stryMutAct_9fa48("7946") ? true : (stryCov_9fa48("7946"), false);
                return;
              }
            }
            const html = await response.text();
            const latestHash = extractBundleHash(html);
            if (stryMutAct_9fa48("7949") ? false : stryMutAct_9fa48("7948") ? true : stryMutAct_9fa48("7947") ? latestHash : (stryCov_9fa48("7947", "7948", "7949"), !latestHash)) {
              if (stryMutAct_9fa48("7950")) {
                {}
              } else {
                stryCov_9fa48("7950");
                isCheckingRef.current = stryMutAct_9fa48("7951") ? true : (stryCov_9fa48("7951"), false);
                return;
              }
            }

            // First run - store the current hash
            if (stryMutAct_9fa48("7954") ? currentHashRef.current !== null : stryMutAct_9fa48("7953") ? false : stryMutAct_9fa48("7952") ? true : (stryCov_9fa48("7952", "7953", "7954"), currentHashRef.current === null)) {
              if (stryMutAct_9fa48("7955")) {
                {}
              } else {
                stryCov_9fa48("7955");
                currentHashRef.current = latestHash;
                isCheckingRef.current = stryMutAct_9fa48("7956") ? true : (stryCov_9fa48("7956"), false);
                return;
              }
            }

            // Check if hash has changed
            if (stryMutAct_9fa48("7959") ? latestHash === currentHashRef.current : stryMutAct_9fa48("7958") ? false : stryMutAct_9fa48("7957") ? true : (stryCov_9fa48("7957", "7958", "7959"), latestHash !== currentHashRef.current)) {
              if (stryMutAct_9fa48("7960")) {
                {}
              } else {
                stryCov_9fa48("7960");
                console.log(stryMutAct_9fa48("7961") ? "" : (stryCov_9fa48("7961"), '[VersionCheck] New version detected! Reloading...'));

                // Brief notification before reload
                const toast = document.createElement(stryMutAct_9fa48("7962") ? "" : (stryCov_9fa48("7962"), 'div'));
                toast.className = stryMutAct_9fa48("7963") ? "" : (stryCov_9fa48("7963"), 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg z-[9999] animate-pulse font-bold text-sm');
                toast.textContent = stryMutAct_9fa48("7964") ? "" : (stryCov_9fa48("7964"), '🚀 New version available! Refreshing...');
                document.body.appendChild(toast);

                // Reload after brief delay
                setTimeout(() => {
                  if (stryMutAct_9fa48("7965")) {
                    {}
                  } else {
                    stryCov_9fa48("7965");
                    window.location.reload();
                  }
                }, RELOAD_DELAY_MS);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("7966")) {
            {}
          } else {
            stryCov_9fa48("7966");
            // Silently fail - network issues shouldn't break the app
            console.debug(stryMutAct_9fa48("7967") ? "" : (stryCov_9fa48("7967"), '[VersionCheck] Check failed:'), error);
          }
        } finally {
          if (stryMutAct_9fa48("7968")) {
            {}
          } else {
            stryCov_9fa48("7968");
            isCheckingRef.current = stryMutAct_9fa48("7969") ? true : (stryCov_9fa48("7969"), false);
          }
        }
      }
    }, stryMutAct_9fa48("7970") ? ["Stryker was here"] : (stryCov_9fa48("7970"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("7971")) {
        {}
      } else {
        stryCov_9fa48("7971");
        if (stryMutAct_9fa48("7974") ? false : stryMutAct_9fa48("7973") ? true : stryMutAct_9fa48("7972") ? enabled : (stryCov_9fa48("7972", "7973", "7974"), !enabled)) return;

        // Only run on deployed environments (dev, staging, production Firebase hosting)
        // Skip if running locally via Vite dev server (localhost or Tailscale)
        const isLocalhost = stryMutAct_9fa48("7977") ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')) && window.location.hostname.startsWith('100.') : stryMutAct_9fa48("7976") ? false : stryMutAct_9fa48("7975") ? true : (stryCov_9fa48("7975", "7976", "7977"), (stryMutAct_9fa48("7979") ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.hostname.startsWith('192.168.') : stryMutAct_9fa48("7978") ? false : (stryCov_9fa48("7978", "7979"), (stryMutAct_9fa48("7981") ? window.location.hostname === 'localhost' && window.location.hostname === '127.0.0.1' : stryMutAct_9fa48("7980") ? false : (stryCov_9fa48("7980", "7981"), (stryMutAct_9fa48("7983") ? window.location.hostname !== 'localhost' : stryMutAct_9fa48("7982") ? false : (stryCov_9fa48("7982", "7983"), window.location.hostname === (stryMutAct_9fa48("7984") ? "" : (stryCov_9fa48("7984"), 'localhost')))) || (stryMutAct_9fa48("7986") ? window.location.hostname !== '127.0.0.1' : stryMutAct_9fa48("7985") ? false : (stryCov_9fa48("7985", "7986"), window.location.hostname === (stryMutAct_9fa48("7987") ? "" : (stryCov_9fa48("7987"), '127.0.0.1')))))) || (stryMutAct_9fa48("7988") ? window.location.hostname.endsWith('192.168.') : (stryCov_9fa48("7988"), window.location.hostname.startsWith(stryMutAct_9fa48("7989") ? "" : (stryCov_9fa48("7989"), '192.168.')))))) || (stryMutAct_9fa48("7990") ? window.location.hostname.endsWith('100.') : (stryCov_9fa48("7990"), window.location.hostname.startsWith(stryMutAct_9fa48("7991") ? "" : (stryCov_9fa48("7991"), '100.'))))); // Tailscale IPs

        if (stryMutAct_9fa48("7993") ? false : stryMutAct_9fa48("7992") ? true : (stryCov_9fa48("7992", "7993"), isLocalhost)) {
          if (stryMutAct_9fa48("7994")) {
            {}
          } else {
            stryCov_9fa48("7994");
            console.debug(stryMutAct_9fa48("7995") ? "" : (stryCov_9fa48("7995"), '[VersionCheck] Disabled for local development'));
            return;
          }
        }

        // Initial check after 5 seconds (to not block initial load)
        const initialTimeout = setTimeout(checkForUpdate, 5000);

        // Periodic checks
        const interval = setInterval(checkForUpdate, CHECK_INTERVAL_MS);

        // Also check when tab becomes visible (user returns to app)
        const handleVisibilityChange = () => {
          if (stryMutAct_9fa48("7996")) {
            {}
          } else {
            stryCov_9fa48("7996");
            if (stryMutAct_9fa48("7999") ? document.visibilityState !== 'visible' : stryMutAct_9fa48("7998") ? false : stryMutAct_9fa48("7997") ? true : (stryCov_9fa48("7997", "7998", "7999"), document.visibilityState === (stryMutAct_9fa48("8000") ? "" : (stryCov_9fa48("8000"), 'visible')))) {
              if (stryMutAct_9fa48("8001")) {
                {}
              } else {
                stryCov_9fa48("8001");
                checkForUpdate();
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("8002") ? "" : (stryCov_9fa48("8002"), 'visibilitychange'), handleVisibilityChange);
        return () => {
          if (stryMutAct_9fa48("8003")) {
            {}
          } else {
            stryCov_9fa48("8003");
            clearTimeout(initialTimeout);
            clearInterval(interval);
            document.removeEventListener(stryMutAct_9fa48("8004") ? "" : (stryCov_9fa48("8004"), 'visibilitychange'), handleVisibilityChange);
          }
        };
      }
    }, stryMutAct_9fa48("8005") ? [] : (stryCov_9fa48("8005"), [enabled, checkForUpdate]));
  }
}