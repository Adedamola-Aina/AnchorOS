interface StreakMilestone {
  days: number;
  emoji: string;
  label: string;
}

const MILESTONES: StreakMilestone[] = [
  { days: 3, emoji: '🌱', label: 'Getting started!' },
  { days: 7, emoji: '⭐', label: '1 week strong!' },
  { days: 14, emoji: '🔥', label: '2 weeks!' },
  { days: 21, emoji: '💪', label: '21-day habit!' },
  { days: 30, emoji: '🏆', label: '1 month!' },
  { days: 60, emoji: '💎', label: '2 months!' },
  { days: 90, emoji: '👑', label: '90-day master!' },
  { days: 180, emoji: '🌟', label: '6 months!' },
  { days: 365, emoji: '🎯', label: '1 year!' },
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
    return `${remaining} more day${remaining === 1 ? '' : 's'} to ${nextMilestone.emoji} ${nextMilestone.label}`;
  }

  return `Incredible ${currentStreak}-day streak! Keep it going!`;
}
