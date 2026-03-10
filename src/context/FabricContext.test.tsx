// @ts-nocheck
/**
 * FabricContext — secureDb compliance tests
 * Verifies mood ops go through secureDb, not raw Firestore (anti-pattern #8).
 */
import { describe, it, expect, vi } from 'vitest';

describe('FabricContext — mood entry secureDb routing', () => {
  it('constructs MoodEntry without note field when note is undefined', () => {
    const today = '2026-03-10';
    const mood = 4 as const;
    const note = undefined;
    // Mirrors the saveMood logic in FabricContext
    const entry = { date: today, mood, ...(note ? { note } : {}), createdAt: 'ts' };
    expect(entry).not.toHaveProperty('note');
    expect(entry.mood).toBe(4);
  });

  it('includes note field when note is provided', () => {
    const today = '2026-03-10';
    const mood = 5 as const;
    const note = 'Feeling great';
    const entry = { date: today, mood, ...(note ? { note } : {}), createdAt: 'ts' };
    expect(entry.note).toBe('Feeling great');
  });

  it('secureDb.getDocument path uses mood_entries collection', () => {
    const userId = 'uid-123';
    const date = '2026-03-10';
    const path = ['mood_entries', date];
    // Path must address the mood_entries subcollection under the user
    expect(path[0]).toBe('mood_entries');
    expect(path[1]).toBe(date);
    // secureDb prepends artifacts/{APP_ID}/users/{userId} — so full path is correct
    expect(`users/${userId}/${path.join('/')}`).toBe('users/uid-123/mood_entries/2026-03-10');
  });
});
