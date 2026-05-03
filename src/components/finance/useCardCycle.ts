/**
 * useCardCycle — Swipe-to-advance cycling logic for wallet card stack.
 *
 * Uses a `MotionValue<number>` (dragY) to track the front-card drag offset
 * without triggering React re-renders. Back cards in `<StackCard>` read the
 * same MotionValue via `useTransform`, so the spring physics on every card
 * settles continuously instead of being restarted on every pointer move.
 *
 * The exit animation is driven by `animate(dragY, target, { onComplete })`,
 * so the rotation commit is synced to the spring physics — no setTimeout.
 */
import { useState, useCallback, useRef } from 'react';
import { useMotionValue, animate, type PanInfo } from 'framer-motion';
import { haptic } from '../../utils/haptic';
import {
  STACK_SPRING_STIFFNESS,
  STACK_SPRING_DAMPING,
} from './cardConstants';

const SWIPE_THRESHOLD_RATIO = 0.32;
const SWIPE_VELOCITY_THRESHOLD = 380; /* px/s — flick gesture short-circuit */
const SWIPE_EXIT_DISTANCE = 120;
const TAP_SUPPRESSION_OFFSET = 6;

export { SWIPE_EXIT_DISTANCE };

export function useCardCycle(accountCount: number, cardHeight: number) {
  const suppressTapRef = useRef(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [cyclingDirection, setCyclingDirection] = useState<'next' | 'previous' | null>(null);

  /* Drag offset shared with all cards — written by framer-motion drag,
     read by back cards via useTransform. No React renders during drag. */
  const dragY = useMotionValue(0);

  /* State mirror, updated only at drag boundaries (kept for backward-compat
     with tests). Not used to drive any per-frame visual. */
  const [dragPreviewOffset, setDragPreviewOffset] = useState(0);

  const commitCycle = useCallback((direction: 'next' | 'previous') => {
    setRotationOffset((prev) => {
      if (accountCount === 0) return prev;
      if (direction === 'next') return prev + 1;
      return (prev - 1 + accountCount) % accountCount;
    });
    setCyclingDirection(null);
    dragY.set(0);
    setDragPreviewOffset(0);
  }, [accountCount, dragY]);

  const handleDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.y) > TAP_SUPPRESSION_OFFSET) {
      suppressTapRef.current = true;
    }
    dragY.set(info.offset.y);
    setDragPreviewOffset(info.offset.y);
  }, [dragY]);

  const animateExit = useCallback((direction: 'next' | 'previous') => {
    const target = direction === 'next'
      ? -(cardHeight + SWIPE_EXIT_DISTANCE)
      : Math.round(cardHeight * 0.46);
    return animate(dragY, target, {
      type: 'spring',
      stiffness: STACK_SPRING_STIFFNESS,
      damping: STACK_SPRING_DAMPING,
      mass: 1,
      velocity: 0,
    });
  }, [cardHeight, dragY]);

  const animateSnapBack = useCallback(() => {
    return animate(dragY, 0, {
      type: 'spring',
      stiffness: 360,
      damping: 32,
      mass: 0.8,
    });
  }, [dragY]);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distanceThreshold = cardHeight * SWIPE_THRESHOLD_RATIO;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    /* Flick: short distance but high velocity still commits. */
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

    /* Cancel — spring back to rest. */
    animateSnapBack();
    setDragPreviewOffset(0);
  }, [cardHeight, animateExit, animateSnapBack, commitCycle]);

  const resetRotation = useCallback(() => setRotationOffset(0), []);

  return {
    suppressTapRef,
    rotationOffset,
    /** State mirror, updated only on drag-end. For visual tracking use `dragY`. */
    dragPreviewOffset,
    /** Live drag offset MotionValue — pass to <StackCard> for smooth tracking. */
    dragY,
    cyclingDirection,
    handleDrag,
    handleDragEnd,
    resetRotation,
  };
}
