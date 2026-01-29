/**
 * PullToRefresh - Mobile pull-to-refresh gesture component
 * 
 * Implements native pull-to-refresh behavior for mobile devices.
 * Uses touch events for gesture detection.
 * 
 * @module components/mobile/PullToRefresh
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
import React, { useState, useRef, useCallback, type ReactNode, type RefObject } from 'react';
import { Loader2 } from 'lucide-react';
export interface PullToRefreshProps {
  /** Callback triggered when refresh gesture completes */
  onRefresh: () => Promise<void>;
  /** Content to wrap with pull-to-refresh behavior */
  children: ReactNode;
  /** Pull distance threshold in pixels before refresh triggers (default: 60) */
  threshold?: number;
  /** Reference to scrollable element to check scroll position */
  scrollRef?: RefObject<HTMLElement>;
  /** Whether pull-to-refresh is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * PullToRefresh wrapper component
 * 
 * @example
 * ```tsx
 * <PullToRefresh onRefresh={async () => await refetchData()}>
 *   <TransactionList transactions={transactions} />
 * </PullToRefresh>
 * ```
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  scrollRef,
  disabled = stryMutAct_9fa48("583") ? true : (stryCov_9fa48("583"), false),
  className = stryMutAct_9fa48("584") ? "Stryker was here!" : (stryCov_9fa48("584"), '')
}) => {
  if (stryMutAct_9fa48("585")) {
    {}
  } else {
    stryCov_9fa48("585");
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(stryMutAct_9fa48("586") ? true : (stryCov_9fa48("586"), false));
    const [isPulling, setIsPulling] = useState(stryMutAct_9fa48("587") ? true : (stryCov_9fa48("587"), false));
    const startY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Check if we're at the top of the scroll container
    const isAtTop = useCallback(() => {
      if (stryMutAct_9fa48("588")) {
        {}
      } else {
        stryCov_9fa48("588");
        if (stryMutAct_9fa48("591") ? scrollRef.current : stryMutAct_9fa48("590") ? false : stryMutAct_9fa48("589") ? true : (stryCov_9fa48("589", "590", "591"), scrollRef?.current)) {
          if (stryMutAct_9fa48("592")) {
            {}
          } else {
            stryCov_9fa48("592");
            return stryMutAct_9fa48("596") ? scrollRef.current.scrollTop > 0 : stryMutAct_9fa48("595") ? scrollRef.current.scrollTop < 0 : stryMutAct_9fa48("594") ? false : stryMutAct_9fa48("593") ? true : (stryCov_9fa48("593", "594", "595", "596"), scrollRef.current.scrollTop <= 0);
          }
        }
        // If no scrollRef, check window scroll
        if (stryMutAct_9fa48("599") ? typeof window === 'undefined' : stryMutAct_9fa48("598") ? false : stryMutAct_9fa48("597") ? true : (stryCov_9fa48("597", "598", "599"), typeof window !== (stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), 'undefined')))) {
          if (stryMutAct_9fa48("601")) {
            {}
          } else {
            stryCov_9fa48("601");
            return stryMutAct_9fa48("605") ? window.scrollY > 0 : stryMutAct_9fa48("604") ? window.scrollY < 0 : stryMutAct_9fa48("603") ? false : stryMutAct_9fa48("602") ? true : (stryCov_9fa48("602", "603", "604", "605"), window.scrollY <= 0);
          }
        }
        return stryMutAct_9fa48("606") ? false : (stryCov_9fa48("606"), true);
      }
    }, stryMutAct_9fa48("607") ? [] : (stryCov_9fa48("607"), [scrollRef]));
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (stryMutAct_9fa48("608")) {
        {}
      } else {
        stryCov_9fa48("608");
        if (stryMutAct_9fa48("611") ? disabled && isRefreshing : stryMutAct_9fa48("610") ? false : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610", "611"), disabled || isRefreshing)) return;
        if (stryMutAct_9fa48("614") ? false : stryMutAct_9fa48("613") ? true : stryMutAct_9fa48("612") ? isAtTop() : (stryCov_9fa48("612", "613", "614"), !isAtTop())) return;

        // Ignore touch events from interactive elements (inputs, buttons, etc.)
        const target = e.target as HTMLElement;
        const interactiveElements = stryMutAct_9fa48("615") ? [] : (stryCov_9fa48("615"), [stryMutAct_9fa48("616") ? "" : (stryCov_9fa48("616"), 'INPUT'), stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), 'TEXTAREA'), stryMutAct_9fa48("618") ? "" : (stryCov_9fa48("618"), 'SELECT'), stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), 'BUTTON'), stryMutAct_9fa48("620") ? "" : (stryCov_9fa48("620"), 'A')]);
        if (stryMutAct_9fa48("623") ? interactiveElements.includes(target.tagName) && target.closest('input, textarea, select, button, a, [role="button"]') : stryMutAct_9fa48("622") ? false : stryMutAct_9fa48("621") ? true : (stryCov_9fa48("621", "622", "623"), interactiveElements.includes(target.tagName) || target.closest(stryMutAct_9fa48("624") ? "" : (stryCov_9fa48("624"), 'input, textarea, select, button, a, [role="button"]')))) {
          if (stryMutAct_9fa48("625")) {
            {}
          } else {
            stryCov_9fa48("625");
            return;
          }
        }
        startY.current = e.touches[0].clientY;
        setIsPulling(stryMutAct_9fa48("626") ? false : (stryCov_9fa48("626"), true));
      }
    }, stryMutAct_9fa48("627") ? [] : (stryCov_9fa48("627"), [disabled, isRefreshing, isAtTop]));
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (stryMutAct_9fa48("628")) {
        {}
      } else {
        stryCov_9fa48("628");
        if (stryMutAct_9fa48("631") ? (!isPulling || disabled) && isRefreshing : stryMutAct_9fa48("630") ? false : stryMutAct_9fa48("629") ? true : (stryCov_9fa48("629", "630", "631"), (stryMutAct_9fa48("633") ? !isPulling && disabled : stryMutAct_9fa48("632") ? false : (stryCov_9fa48("632", "633"), (stryMutAct_9fa48("634") ? isPulling : (stryCov_9fa48("634"), !isPulling)) || disabled)) || isRefreshing)) return;
        if (stryMutAct_9fa48("637") ? false : stryMutAct_9fa48("636") ? true : stryMutAct_9fa48("635") ? isAtTop() : (stryCov_9fa48("635", "636", "637"), !isAtTop())) {
          if (stryMutAct_9fa48("638")) {
            {}
          } else {
            stryCov_9fa48("638");
            setPullDistance(0);
            return;
          }
        }
        const currentY = e.touches[0].clientY;
        const distance = stryMutAct_9fa48("639") ? Math.min(0, currentY - startY.current) : (stryCov_9fa48("639"), Math.max(0, stryMutAct_9fa48("640") ? currentY + startY.current : (stryCov_9fa48("640"), currentY - startY.current)));

        // Apply resistance - pulling gets harder as you pull more
        const resistedDistance = stryMutAct_9fa48("641") ? Math.max(distance * 0.5, threshold * 2) : (stryCov_9fa48("641"), Math.min(stryMutAct_9fa48("642") ? distance / 0.5 : (stryCov_9fa48("642"), distance * 0.5), stryMutAct_9fa48("643") ? threshold / 2 : (stryCov_9fa48("643"), threshold * 2)));
        setPullDistance(resistedDistance);
      }
    }, stryMutAct_9fa48("644") ? [] : (stryCov_9fa48("644"), [isPulling, disabled, isRefreshing, isAtTop, threshold]));
    const handleTouchEnd = useCallback(async () => {
      if (stryMutAct_9fa48("645")) {
        {}
      } else {
        stryCov_9fa48("645");
        if (stryMutAct_9fa48("648") ? false : stryMutAct_9fa48("647") ? true : stryMutAct_9fa48("646") ? isPulling : (stryCov_9fa48("646", "647", "648"), !isPulling)) return;
        setIsPulling(stryMutAct_9fa48("649") ? true : (stryCov_9fa48("649"), false));
        if (stryMutAct_9fa48("652") ? pullDistance >= threshold && !isRefreshing || !disabled : stryMutAct_9fa48("651") ? false : stryMutAct_9fa48("650") ? true : (stryCov_9fa48("650", "651", "652"), (stryMutAct_9fa48("654") ? pullDistance >= threshold || !isRefreshing : stryMutAct_9fa48("653") ? true : (stryCov_9fa48("653", "654"), (stryMutAct_9fa48("657") ? pullDistance < threshold : stryMutAct_9fa48("656") ? pullDistance > threshold : stryMutAct_9fa48("655") ? true : (stryCov_9fa48("655", "656", "657"), pullDistance >= threshold)) && (stryMutAct_9fa48("658") ? isRefreshing : (stryCov_9fa48("658"), !isRefreshing)))) && (stryMutAct_9fa48("659") ? disabled : (stryCov_9fa48("659"), !disabled)))) {
          if (stryMutAct_9fa48("660")) {
            {}
          } else {
            stryCov_9fa48("660");
            setIsRefreshing(stryMutAct_9fa48("661") ? false : (stryCov_9fa48("661"), true));
            try {
              if (stryMutAct_9fa48("662")) {
                {}
              } else {
                stryCov_9fa48("662");
                await onRefresh();
              }
            } finally {
              if (stryMutAct_9fa48("663")) {
                {}
              } else {
                stryCov_9fa48("663");
                setIsRefreshing(stryMutAct_9fa48("664") ? true : (stryCov_9fa48("664"), false));
                setPullDistance(0);
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("665")) {
            {}
          } else {
            stryCov_9fa48("665");
            setPullDistance(0);
          }
        }
      }
    }, stryMutAct_9fa48("666") ? [] : (stryCov_9fa48("666"), [isPulling, pullDistance, threshold, isRefreshing, disabled, onRefresh]));

    // Calculate progress percentage (0-100)
    const progress = stryMutAct_9fa48("667") ? Math.max(100, Math.round(pullDistance / threshold * 100)) : (stryCov_9fa48("667"), Math.min(100, Math.round(stryMutAct_9fa48("668") ? pullDistance / threshold / 100 : (stryCov_9fa48("668"), (stryMutAct_9fa48("669") ? pullDistance * threshold : (stryCov_9fa48("669"), pullDistance / threshold)) * 100))));
    const showIndicator = stryMutAct_9fa48("672") ? pullDistance > 10 && isRefreshing : stryMutAct_9fa48("671") ? false : stryMutAct_9fa48("670") ? true : (stryCov_9fa48("670", "671", "672"), (stryMutAct_9fa48("675") ? pullDistance <= 10 : stryMutAct_9fa48("674") ? pullDistance >= 10 : stryMutAct_9fa48("673") ? false : (stryCov_9fa48("673", "674", "675"), pullDistance > 10)) || isRefreshing);
    return <div ref={containerRef} data-testid="pull-to-refresh-container" className={stryMutAct_9fa48("676") ? `` : (stryCov_9fa48("676"), `relative ${className}`)} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Pull indicator */}
      {stryMutAct_9fa48("679") ? showIndicator || <div role="status" aria-label={isRefreshing ? 'Refreshing content' : 'Pull to refresh'} aria-busy={isRefreshing} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="absolute left-0 right-0 flex justify-center transition-all duration-200 z-10" style={{
        top: Math.min(pullDistance - 40, 20),
        opacity: Math.min(1, pullDistance / (threshold * 0.5))
      }}>
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full 
            bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700
            ${isRefreshing ? 'animate-pulse' : ''}
          `}>
            <Loader2 className={`w-5 h-5 text-primary-500 ${isRefreshing ? 'animate-spin' : ''}`} style={{
            transform: isRefreshing ? 'none' : `rotate(${progress * 3.6}deg)`
          }} />
          </div>
        </div> : stryMutAct_9fa48("678") ? false : stryMutAct_9fa48("677") ? true : (stryCov_9fa48("677", "678", "679"), showIndicator && <div role="status" aria-label={isRefreshing ? stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), 'Refreshing content') : stryMutAct_9fa48("681") ? "" : (stryCov_9fa48("681"), 'Pull to refresh')} aria-busy={isRefreshing} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="absolute left-0 right-0 flex justify-center transition-all duration-200 z-10" style={stryMutAct_9fa48("682") ? {} : (stryCov_9fa48("682"), {
        top: stryMutAct_9fa48("683") ? Math.max(pullDistance - 40, 20) : (stryCov_9fa48("683"), Math.min(stryMutAct_9fa48("684") ? pullDistance + 40 : (stryCov_9fa48("684"), pullDistance - 40), 20)),
        opacity: stryMutAct_9fa48("685") ? Math.max(1, pullDistance / (threshold * 0.5)) : (stryCov_9fa48("685"), Math.min(1, stryMutAct_9fa48("686") ? pullDistance * (threshold * 0.5) : (stryCov_9fa48("686"), pullDistance / (stryMutAct_9fa48("687") ? threshold / 0.5 : (stryCov_9fa48("687"), threshold * 0.5)))))
      })}>
          <div className={stryMutAct_9fa48("688") ? `` : (stryCov_9fa48("688"), `
            flex items-center justify-center w-10 h-10 rounded-full 
            bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700
            ${isRefreshing ? stryMutAct_9fa48("689") ? "" : (stryCov_9fa48("689"), 'animate-pulse') : stryMutAct_9fa48("690") ? "Stryker was here!" : (stryCov_9fa48("690"), '')}
          `)}>
            <Loader2 className={stryMutAct_9fa48("691") ? `` : (stryCov_9fa48("691"), `w-5 h-5 text-primary-500 ${isRefreshing ? stryMutAct_9fa48("692") ? "" : (stryCov_9fa48("692"), 'animate-spin') : stryMutAct_9fa48("693") ? "Stryker was here!" : (stryCov_9fa48("693"), '')}`)} style={stryMutAct_9fa48("694") ? {} : (stryCov_9fa48("694"), {
            transform: isRefreshing ? stryMutAct_9fa48("695") ? "" : (stryCov_9fa48("695"), 'none') : stryMutAct_9fa48("696") ? `` : (stryCov_9fa48("696"), `rotate(${stryMutAct_9fa48("697") ? progress / 3.6 : (stryCov_9fa48("697"), progress * 3.6)}deg)`)
          })} />
          </div>
        </div>)}

      {/* Content with pull offset */}
      <div style={stryMutAct_9fa48("698") ? {} : (stryCov_9fa48("698"), {
        transform: stryMutAct_9fa48("699") ? `` : (stryCov_9fa48("699"), `translateY(${pullDistance}px)`),
        transition: isPulling ? stryMutAct_9fa48("700") ? "" : (stryCov_9fa48("700"), 'none') : stryMutAct_9fa48("701") ? "" : (stryCov_9fa48("701"), 'transform 0.2s ease-out')
      })}>
        {children}
      </div>
    </div>;
  }
};
export default PullToRefresh;