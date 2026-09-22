import { describe, it, expect } from 'vitest';
import { getStreakMilestone } from './streakUtils';

describe('getStreakMilestone', () => {
  it('returns null for streak 0', () => {
    expect(getStreakMilestone(0)).toBeNull();
  });

  it('returns milestone for streak of 3', () => {
    expect(getStreakMilestone(3)).toEqual(expect.objectContaining({ days: 3 }));
  });

  it('returns milestone for streak of 7', () => {
    const m = getStreakMilestone(7);
    expect(m).toBeTruthy();
    expect(m!.days).toBe(7);
  });

  it('returns milestone for streak of 30', () => {
    const m = getStreakMilestone(30);
    expect(m).toBeTruthy();
    expect(m!.days).toBe(30);
  });

  it('returns null for non-milestone streak', () => {
    expect(getStreakMilestone(4)).toBeNull();
  });
});

// UX-DS-01: the milestone used to carry an emoji (🔥); it now carries a Lucide
// component, and nothing in this module interpolates a glyph.
describe('UX-DS-01: milestones are Lucide icons, not emoji', () => {
  it('exposes an icon component instead of an emoji field', () => {
    const m = getStreakMilestone(7);
    expect(m).toBeTruthy();
    expect(typeof m!.icon).toBe('object');
    expect(m).not.toHaveProperty('emoji');
  });

  it('never exposes a glyph in any milestone label', () => {
    const emojiPattern = /\p{Extended_Pictographic}/u;
    for (const days of [3, 7, 14, 21, 30, 60, 90, 180, 365]) {
      expect(emojiPattern.test(getStreakMilestone(days)!.label)).toBe(false);
    }
  });
});

/**
 * The lapsed-streak "encouragement" used to be the only nudge anybody saw:
 * "Your best was 1 days — you can get back there!" — ungrammatical, and shown
 * under a commitment the user had not done yet. It is gone; this pins the removal
 * so it cannot quietly come back.
 */
describe('no lapsed-streak nagging', () => {
  it('exposes no nudge helper at all', async () => {
    const module = await import('./streakUtils');
    expect(module).not.toHaveProperty('getStreakNudge');
  });
});
