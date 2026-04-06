import { describe, it, expect } from 'vitest';
import { getStreakMilestone, getStreakNudge } from './streakUtils';

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

describe('getStreakNudge', () => {
  it('returns encouragement when streak is 0 and longest > 0', () => {
    const nudge = getStreakNudge(0, 5);
    expect(nudge).toBeTruthy();
    expect(nudge).toContain('5');
  });

  it('returns progress message when streak is active', () => {
    const nudge = getStreakNudge(3, 10);
    expect(nudge).toBeTruthy();
  });

  it('returns null when no meaningful streak data', () => {
    expect(getStreakNudge(0, 0)).toBeNull();
  });

  it('returns celebration for high active streaks', () => {
    const nudge = getStreakNudge(14, 14);
    expect(nudge).toBeTruthy();
  });
});
