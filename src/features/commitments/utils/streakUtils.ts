import {
  Sprout,
  Star,
  Flame,
  Dumbbell,
  Trophy,
  Gem,
  Crown,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';

/**
 * UX-DS-01: milestones carry a Lucide icon, not an emoji.
 *
 * `docs/DESIGN_SYSTEM.md` says "Lucide React exclusively" for functional
 * states. A streak milestone *is* functional (it reports progress), so the
 * emoji that used to live here (🌱⭐🔥💪🏆💎👑🌟🎯) were a contract violation:
 * they render differently per platform, cannot inherit `currentColor`, and
 * expose a glyph with no accessible text. The icon is now a component so the
 * badge can render it at the right size and mark it `aria-hidden`, with the
 * label carrying the meaning.
 */
export interface StreakMilestone {
  days: number;
  icon: LucideIcon;
  label: string;
}

const MILESTONES: StreakMilestone[] = [
  { days: 3, icon: Sprout, label: 'Getting started!' },
  { days: 7, icon: Star, label: '1 week strong!' },
  { days: 14, icon: Flame, label: '2 weeks!' },
  { days: 21, icon: Dumbbell, label: '21-day habit!' },
  { days: 30, icon: Trophy, label: '1 month!' },
  { days: 60, icon: Gem, label: '2 months!' },
  { days: 90, icon: Crown, label: '90-day master!' },
  { days: 180, icon: Sparkles, label: '6 months!' },
  { days: 365, icon: Target, label: '1 year!' },
];

export function getStreakMilestone(streak: number): StreakMilestone | null {
  return MILESTONES.find((m) => m.days === streak) ?? null;
}

export function getStreakNudge(
  currentStreak: number,
  longestStreak: number,
): string | null {
  if (currentStreak === 0 && longestStreak === 0) return null;

  if (currentStreak === 0 && longestStreak > 0) {
    return `Your best was ${longestStreak} days — you can get back there!`;
  }

  const nextMilestone = MILESTONES.find((m) => m.days > currentStreak);
  if (nextMilestone) {
    const remaining = nextMilestone.days - currentStreak;
    // UX-DS-01: the milestone icon now renders as a component next to this
    // text, so the nudge string no longer interpolates a glyph.
    return `${remaining} more day${remaining === 1 ? '' : 's'} to ${nextMilestone.label}`;
  }

  return `Incredible ${currentStreak}-day streak! Keep it going!`;
}
