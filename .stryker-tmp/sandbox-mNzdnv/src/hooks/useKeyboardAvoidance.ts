/**
 * useKeyboardAvoidance - Hook to handle iOS virtual keyboard covering inputs
 * 
 * BUG-002 Fix: Uses visualViewport API to detect keyboard presence
 * and scroll focused elements into view.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
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
import { useState, useEffect, useCallback, useRef } from 'react';
interface KeyboardAvoidanceState {
  /** Whether the virtual keyboard is currently visible */
  isKeyboardVisible: boolean;
  /** Height of the keyboard in pixels */
  keyboardHeight: number;
  /** Scroll the currently focused element into view */
  scrollActiveElementIntoView: () => void;
}

// Minimum height difference to consider as keyboard (100px threshold)
const KEYBOARD_THRESHOLD = 100;
export function useKeyboardAvoidance(): KeyboardAvoidanceState {
  if (stryMutAct_9fa48("7696")) {
    {}
  } else {
    stryCov_9fa48("7696");
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(stryMutAct_9fa48("7697") ? true : (stryCov_9fa48("7697"), false));
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const initialHeightRef = useRef<number>((stryMutAct_9fa48("7700") ? typeof window === 'undefined' : stryMutAct_9fa48("7699") ? false : stryMutAct_9fa48("7698") ? true : (stryCov_9fa48("7698", "7699", "7700"), typeof window !== (stryMutAct_9fa48("7701") ? "" : (stryCov_9fa48("7701"), 'undefined')))) ? window.innerHeight : 0);

    /**
     * Scroll the currently focused element into view
     * Uses smooth scrolling and accounts for keyboard height
     */
    const scrollActiveElementIntoView = useCallback(() => {
      if (stryMutAct_9fa48("7702")) {
        {}
      } else {
        stryCov_9fa48("7702");
        const activeElement = document.activeElement as HTMLElement | null;
        if (stryMutAct_9fa48("7705") ? activeElement || 'scrollIntoView' in activeElement : stryMutAct_9fa48("7704") ? false : stryMutAct_9fa48("7703") ? true : (stryCov_9fa48("7703", "7704", "7705"), activeElement && (stryMutAct_9fa48("7706") ? "" : (stryCov_9fa48("7706"), 'scrollIntoView')) in activeElement)) {
          if (stryMutAct_9fa48("7707")) {
            {}
          } else {
            stryCov_9fa48("7707");
            // Use scrollIntoView with block: 'center' to ensure visibility
            activeElement.scrollIntoView(stryMutAct_9fa48("7708") ? {} : (stryCov_9fa48("7708"), {
              behavior: stryMutAct_9fa48("7709") ? "" : (stryCov_9fa48("7709"), 'smooth'),
              block: stryMutAct_9fa48("7710") ? "" : (stryCov_9fa48("7710"), 'center'),
              inline: stryMutAct_9fa48("7711") ? "" : (stryCov_9fa48("7711"), 'nearest')
            }));
          }
        }
      }
    }, stryMutAct_9fa48("7712") ? ["Stryker was here"] : (stryCov_9fa48("7712"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("7713")) {
        {}
      } else {
        stryCov_9fa48("7713");
        const visualViewport = window.visualViewport;

        // If visualViewport API is not supported, return early
        if (stryMutAct_9fa48("7716") ? false : stryMutAct_9fa48("7715") ? true : stryMutAct_9fa48("7714") ? visualViewport : (stryCov_9fa48("7714", "7715", "7716"), !visualViewport)) {
          if (stryMutAct_9fa48("7717")) {
            {}
          } else {
            stryCov_9fa48("7717");
            return;
          }
        }
        const handleResize = () => {
          if (stryMutAct_9fa48("7718")) {
            {}
          } else {
            stryCov_9fa48("7718");
            const currentHeight = visualViewport.height;
            const heightDifference = stryMutAct_9fa48("7719") ? initialHeightRef.current + currentHeight : (stryCov_9fa48("7719"), initialHeightRef.current - currentHeight);
            if (stryMutAct_9fa48("7723") ? heightDifference <= KEYBOARD_THRESHOLD : stryMutAct_9fa48("7722") ? heightDifference >= KEYBOARD_THRESHOLD : stryMutAct_9fa48("7721") ? false : stryMutAct_9fa48("7720") ? true : (stryCov_9fa48("7720", "7721", "7722", "7723"), heightDifference > KEYBOARD_THRESHOLD)) {
              if (stryMutAct_9fa48("7724")) {
                {}
              } else {
                stryCov_9fa48("7724");
                // Keyboard is visible
                setIsKeyboardVisible(stryMutAct_9fa48("7725") ? false : (stryCov_9fa48("7725"), true));
                setKeyboardHeight(heightDifference);

                // Auto-scroll focused element into view
                // Use setTimeout to allow layout to settle
                setTimeout(() => {
                  if (stryMutAct_9fa48("7726")) {
                    {}
                  } else {
                    stryCov_9fa48("7726");
                    scrollActiveElementIntoView();
                  }
                }, 100);
              }
            } else {
              if (stryMutAct_9fa48("7727")) {
                {}
              } else {
                stryCov_9fa48("7727");
                // Keyboard is hidden or change is too small
                setIsKeyboardVisible(stryMutAct_9fa48("7728") ? true : (stryCov_9fa48("7728"), false));
                setKeyboardHeight(0);
              }
            }
          }
        };
        visualViewport.addEventListener(stryMutAct_9fa48("7729") ? "" : (stryCov_9fa48("7729"), 'resize'), handleResize);
        return () => {
          if (stryMutAct_9fa48("7730")) {
            {}
          } else {
            stryCov_9fa48("7730");
            visualViewport.removeEventListener(stryMutAct_9fa48("7731") ? "" : (stryCov_9fa48("7731"), 'resize'), handleResize);
          }
        };
      }
    }, stryMutAct_9fa48("7732") ? [] : (stryCov_9fa48("7732"), [scrollActiveElementIntoView]));
    return stryMutAct_9fa48("7733") ? {} : (stryCov_9fa48("7733"), {
      isKeyboardVisible,
      keyboardHeight,
      scrollActiveElementIntoView
    });
  }
}
export default useKeyboardAvoidance;