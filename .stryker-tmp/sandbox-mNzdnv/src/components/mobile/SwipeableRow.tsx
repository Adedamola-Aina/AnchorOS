/**
 * SwipeableRow Component
 * 
 * A touch-enabled row component that reveals actions when swiped.
 * - Swipe left to reveal right action (e.g., delete)
 * - Swipe right to reveal left action (e.g., edit)
 * 
 * Uses native touch events for optimal mobile performance.
 * No external library dependencies (per AD-2 in mob_opt_phase2_plan.md).
 * 
 * @module components/mobile/SwipeableRow
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
import { useState, useRef, useCallback, type ReactNode } from 'react';
export interface SwipeAction {
  label: string;
  color: 'blue' | 'red' | 'green' | 'gray';
  icon?: ReactNode;
}
export interface SwipeableRowProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}
const ACTION_WIDTH = 80;
const DEFAULT_THRESHOLD = 60;
const colorClasses: Record<string, string> = stryMutAct_9fa48("702") ? {} : (stryCov_9fa48("702"), {
  blue: stryMutAct_9fa48("703") ? "" : (stryCov_9fa48("703"), 'bg-blue-500 text-white'),
  red: stryMutAct_9fa48("704") ? "" : (stryCov_9fa48("704"), 'bg-red-500 text-white'),
  green: stryMutAct_9fa48("705") ? "" : (stryCov_9fa48("705"), 'bg-green-500 text-white'),
  gray: stryMutAct_9fa48("706") ? "" : (stryCov_9fa48("706"), 'bg-gray-500 text-white')
});
export function SwipeableRow({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = DEFAULT_THRESHOLD,
  disabled = stryMutAct_9fa48("707") ? true : (stryCov_9fa48("707"), false),
  className = stryMutAct_9fa48("708") ? "Stryker was here!" : (stryCov_9fa48("708"), '')
}: SwipeableRowProps) {
  if (stryMutAct_9fa48("709")) {
    {}
  } else {
    stryCov_9fa48("709");
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(stryMutAct_9fa48("710") ? true : (stryCov_9fa48("710"), false));
    const startXRef = useRef(0);
    const currentXRef = useRef(0);
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (stryMutAct_9fa48("711")) {
        {}
      } else {
        stryCov_9fa48("711");
        if (stryMutAct_9fa48("713") ? false : stryMutAct_9fa48("712") ? true : (stryCov_9fa48("712", "713"), disabled)) return;

        // Ignore touch events from interactive elements (inputs, buttons, etc.)
        const target = e.target as HTMLElement;
        const interactiveElements = stryMutAct_9fa48("714") ? [] : (stryCov_9fa48("714"), [stryMutAct_9fa48("715") ? "" : (stryCov_9fa48("715"), 'INPUT'), stryMutAct_9fa48("716") ? "" : (stryCov_9fa48("716"), 'TEXTAREA'), stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), 'SELECT'), stryMutAct_9fa48("718") ? "" : (stryCov_9fa48("718"), 'BUTTON'), stryMutAct_9fa48("719") ? "" : (stryCov_9fa48("719"), 'A')]);
        if (stryMutAct_9fa48("722") ? interactiveElements.includes(target.tagName) && target.closest('input, textarea, select, button, a, [role="button"]') : stryMutAct_9fa48("721") ? false : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721", "722"), interactiveElements.includes(target.tagName) || target.closest(stryMutAct_9fa48("723") ? "" : (stryCov_9fa48("723"), 'input, textarea, select, button, a, [role="button"]')))) {
          if (stryMutAct_9fa48("724")) {
            {}
          } else {
            stryCov_9fa48("724");
            return;
          }
        }
        startXRef.current = e.touches[0].clientX;
        currentXRef.current = 0;
        setIsDragging(stryMutAct_9fa48("725") ? false : (stryCov_9fa48("725"), true));
      }
    }, stryMutAct_9fa48("726") ? [] : (stryCov_9fa48("726"), [disabled]));
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (stryMutAct_9fa48("727")) {
        {}
      } else {
        stryCov_9fa48("727");
        if (stryMutAct_9fa48("730") ? disabled && !isDragging : stryMutAct_9fa48("729") ? false : stryMutAct_9fa48("728") ? true : (stryCov_9fa48("728", "729", "730"), disabled || (stryMutAct_9fa48("731") ? isDragging : (stryCov_9fa48("731"), !isDragging)))) return;
        const deltaX = stryMutAct_9fa48("732") ? e.touches[0].clientX + startXRef.current : (stryCov_9fa48("732"), e.touches[0].clientX - startXRef.current);
        currentXRef.current = deltaX;

        // Limit swipe distance
        const maxSwipe = ACTION_WIDTH;
        const clampedX = stryMutAct_9fa48("733") ? Math.min(-maxSwipe, Math.min(maxSwipe, deltaX)) : (stryCov_9fa48("733"), Math.max(stryMutAct_9fa48("734") ? +maxSwipe : (stryCov_9fa48("734"), -maxSwipe), stryMutAct_9fa48("735") ? Math.max(maxSwipe, deltaX) : (stryCov_9fa48("735"), Math.min(maxSwipe, deltaX))));
        setTranslateX(clampedX);
      }
    }, stryMutAct_9fa48("736") ? [] : (stryCov_9fa48("736"), [disabled, isDragging]));
    const handleTouchEnd = useCallback(() => {
      if (stryMutAct_9fa48("737")) {
        {}
      } else {
        stryCov_9fa48("737");
        if (stryMutAct_9fa48("739") ? false : stryMutAct_9fa48("738") ? true : (stryCov_9fa48("738", "739"), disabled)) return;
        setIsDragging(stryMutAct_9fa48("740") ? true : (stryCov_9fa48("740"), false));
        const deltaX = currentXRef.current;

        // Check if swipe exceeded threshold
        if (stryMutAct_9fa48("744") ? Math.abs(deltaX) < threshold : stryMutAct_9fa48("743") ? Math.abs(deltaX) > threshold : stryMutAct_9fa48("742") ? false : stryMutAct_9fa48("741") ? true : (stryCov_9fa48("741", "742", "743", "744"), Math.abs(deltaX) >= threshold)) {
          if (stryMutAct_9fa48("745")) {
            {}
          } else {
            stryCov_9fa48("745");
            if (stryMutAct_9fa48("748") ? deltaX < 0 || onSwipeLeft : stryMutAct_9fa48("747") ? false : stryMutAct_9fa48("746") ? true : (stryCov_9fa48("746", "747", "748"), (stryMutAct_9fa48("751") ? deltaX >= 0 : stryMutAct_9fa48("750") ? deltaX <= 0 : stryMutAct_9fa48("749") ? true : (stryCov_9fa48("749", "750", "751"), deltaX < 0)) && onSwipeLeft)) {
              if (stryMutAct_9fa48("752")) {
                {}
              } else {
                stryCov_9fa48("752");
                onSwipeLeft();
              }
            } else if (stryMutAct_9fa48("755") ? deltaX > 0 || onSwipeRight : stryMutAct_9fa48("754") ? false : stryMutAct_9fa48("753") ? true : (stryCov_9fa48("753", "754", "755"), (stryMutAct_9fa48("758") ? deltaX <= 0 : stryMutAct_9fa48("757") ? deltaX >= 0 : stryMutAct_9fa48("756") ? true : (stryCov_9fa48("756", "757", "758"), deltaX > 0)) && onSwipeRight)) {
              if (stryMutAct_9fa48("759")) {
                {}
              } else {
                stryCov_9fa48("759");
                onSwipeRight();
              }
            }
          }
        }

        // Reset position with animation
        setTranslateX(0);
      }
    }, stryMutAct_9fa48("760") ? [] : (stryCov_9fa48("760"), [disabled, threshold, onSwipeLeft, onSwipeRight]));
    return <div data-testid="swipeable-row" className={stryMutAct_9fa48("761") ? `` : (stryCov_9fa48("761"), `relative overflow-hidden rounded-2xl ${className}`)}>
      {/* Left action (revealed when swiping right) */}
      {stryMutAct_9fa48("764") ? leftAction || <div data-testid="left-action" aria-hidden="true" className={`absolute inset-y-0 left-0 flex items-center justify-center ${colorClasses[leftAction.color]}`} style={{
        width: ACTION_WIDTH
      }}>
          {leftAction.icon}
          <span className="text-sm font-medium">{leftAction.label}</span>
        </div> : stryMutAct_9fa48("763") ? false : stryMutAct_9fa48("762") ? true : (stryCov_9fa48("762", "763", "764"), leftAction && <div data-testid="left-action" aria-hidden="true" className={stryMutAct_9fa48("765") ? `` : (stryCov_9fa48("765"), `absolute inset-y-0 left-0 flex items-center justify-center ${colorClasses[leftAction.color]}`)} style={stryMutAct_9fa48("766") ? {} : (stryCov_9fa48("766"), {
        width: ACTION_WIDTH
      })}>
          {leftAction.icon}
          <span className="text-sm font-medium">{leftAction.label}</span>
        </div>)}

      {/* Right action (revealed when swiping left) */}
      {stryMutAct_9fa48("769") ? rightAction || <div data-testid="right-action" aria-hidden="true" className={`absolute inset-y-0 right-0 flex items-center justify-center ${colorClasses[rightAction.color]}`} style={{
        width: ACTION_WIDTH
      }}>
          {rightAction.icon}
          <span className="text-sm font-medium">{rightAction.label}</span>
        </div> : stryMutAct_9fa48("768") ? false : stryMutAct_9fa48("767") ? true : (stryCov_9fa48("767", "768", "769"), rightAction && <div data-testid="right-action" aria-hidden="true" className={stryMutAct_9fa48("770") ? `` : (stryCov_9fa48("770"), `absolute inset-y-0 right-0 flex items-center justify-center ${colorClasses[rightAction.color]}`)} style={stryMutAct_9fa48("771") ? {} : (stryCov_9fa48("771"), {
        width: ACTION_WIDTH
      })}>
          {rightAction.icon}
          <span className="text-sm font-medium">{rightAction.label}</span>
        </div>)}

      {/* Content wrapper - matches Card background to hide action buttons when not swiping */}
      <div data-testid="swipeable-content" className={stryMutAct_9fa48("772") ? `` : (stryCov_9fa48("772"), `relative bg-white dark:bg-slate-900 rounded-2xl transition-transform ${isDragging ? stryMutAct_9fa48("773") ? "" : (stryCov_9fa48("773"), 'duration-0') : stryMutAct_9fa48("774") ? "" : (stryCov_9fa48("774"), 'duration-200')}`)} style={stryMutAct_9fa48("775") ? {} : (stryCov_9fa48("775"), {
        transform: stryMutAct_9fa48("776") ? `` : (stryCov_9fa48("776"), `translateX(${translateX}px)`)
      })} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {children}
      </div>
    </div>;
  }
}