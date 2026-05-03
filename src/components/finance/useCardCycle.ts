/**
 * useCardCycle — Swipe-to-advance cycling logic for wallet card stack.
 *
 * Architecture for smooth motion:
 *   - `dragY: MotionValue<number>` is the front-card drag offset, shared
 *     with all cards. Back cards read it via `useTransform` so dragging
 *     produces zero React re-renders and continuous spring physics.
 *   - Exit animation is duration-based (Apple's preferred ease curve) so
 *     swipe feels deliberate and predictable, not bouncy.
 *   - On commit, rotation flips AND `dragY` springs back to 0 — both the
 *     `top` change (CSS transition in StackCard) and the `y` motion value
 *     animate together to the new resting layout.
 *   - The formerly-front card is briefly hidden (CardStack handles this)
 *     to mask the unavoidable binding swap (raw `dragY` ↔ factored).
 */
import { useState, useCallback, useRef } from 'react';
import { useMotionValue, animate, type PanInfo } from 'framer-motion';
import { haptic } from '../../utils/haptic';

const SWIPE_THRESHOLD_RATIO = 0.32;
const SWIPE_VELOCITY_THRESHOLD = 380; /* px/s — flick gesture short-circuit */
const SWIPE_EXIT_DISTANCE = 120;
const TAP_SUPPRESSION_OFFSET = 6;

/** Apple-style ease for purposeful motion (UIView animations). */
const APPLE_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const EXIT_DURATION_S = 0.22;

export { SWIPE_EXIT_DISTANCE };

export function useCardCycle(accountCount: number, cardHeight: number) {
  const suppressTapRef = useRef(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [cyclingDirection, setCyclingDirection] = useState<'next' | 'previous' | null>(null);

  const dragY = useMotionValue(0);
  const [dragPreviewOffset, setDragPreviewOffset] = useState(0);

  const commitCycle = useCallback((direction: 'next' | 'previous') => {
    setRotationOffset((prev) => {
      if (accountCount === 0) return prev;
      if (direction === 'next') return prev + 1;
      return (prev - 1 + accountCount) % accountCount;
    });
    setCyclingDirection(null);
    /* Smoothly bring dragY back to 0 — back cards' useTransform outputs
       follow this animation, so they ease into their new slot positions
       in lock-step with the CSS top transition. */
    animate(dragY, 0, {
      type: 'spring',
      stiffness: 380,
      damping: 34,
      mass: 0.8,
    });
    setDragPreviewOffset(0);
  }, [accountCount, dragY]);

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.y) > TAP_SUPPRESSION_OFFSET) {
        suppressTapRef.current = true;
      }
      dragY.set(info.offset.y);
      setDragPreviewOffset(info.offset.y);
    },
    [dragY],
  );

  const animateExit = useCallback(
    (direction: 'next' | 'previous') => {
      const target =
        direction === 'next'
          ? -(cardHeight + SWIPE_EXIT_DISTANCE)
          : Math.round(cardHeight * 0.46);
      return animate(dragY, target, {
        duration: EXIT_DURATION_S,
        ease: APPLE_EASE,
      });
    },
    [cardHeight, dragY],
  );

  const animateSnapBack = useCallback(
    () =>
      animate(dragY, 0, {
        type: 'spring',
        stiffness: 380,
        damping: 32,
        mass: 0.8,
      }),
    [dragY],
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const distanceThreshold = cardHeight * SWIPE_THRESHOLD_RATIO;
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      const flickedUp = velocity < -SWIPE_VELOCITY_THRESHOLD;
      const flickedDown = velocity > SWIPE_VELOCITY_THRESHOLD;

      if (offset <= -distanceThreshold || flickedUp) {
        haptic.selection();
        setCyclingDirection('next');
        const ctrl = animateExit('next');
        ctrl.then(() => commitCycle('next'));
        return;
      }
      if (offset >= distanceThreshold || flickedDown) {
        haptic.selection();
        setCyclingDirection('previous');
        const ctrl = animateExit('previous');
        ctrl.then(() => commitCycle('previous'));
        return;
      }

      animateSnapBack();
      setDragPreviewOffset(0);
    },
    [cardHeight, animateExit, animateSnapBack, commitCycle],
  );

  const resetRotation = useCallback(() => setRotationOffset(0), []);

  return {
    suppressTapRef,
    rotationOffset,
    dragPreviewOffset,
    dragY,
    cyclingDirection,
    handleDrag,
    handleDragEnd,
    resetRotation,
  };
}
