import type { Variants } from 'framer-motion';

export const microMotion = {
  createSlideIn: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: 'easeOut' } },
  } satisfies Variants,
  savePulse: {
    idle: { scale: 1 },
    saving: { scale: [1, 1.02, 1], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } },
    done: { scale: [1, 1.08, 1], transition: { duration: 0.32, ease: 'easeOut' } },
  } satisfies Variants,
  completionPop: {
    idle: { scale: 1 },
    complete: { scale: [1, 1.18, 1], transition: { duration: 0.35, ease: 'easeOut' } },
  } satisfies Variants,
  netWorthRise: {
    idle: { opacity: 0 },
    rise: { opacity: [0, 0.22, 0], transition: { duration: 1.1, ease: 'easeOut' } },
  } satisfies Variants,
};
