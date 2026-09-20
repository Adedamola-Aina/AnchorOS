import { describe, it, expect } from 'vitest';
import { buildBottomNavItems } from './bottomNavigationItems';

const base = { accountColors: [], isDarkMode: false };

describe('buildBottomNavItems', () => {
  // UX-GL-03: one destination vocabulary — Home / Commitments / Finance / Settings.
  it('uses the shared destination vocabulary: Home, Commitments, Finance, Settings', () => {
    const items = buildBottomNavItems({ ...base });
    expect(items.map(i => i.label)).toEqual(['Home', 'Commitments', 'Finance', 'Settings']);
    expect(items.map(i => i.to)).toEqual(['/dashboard', '/commitments', '/finance', '/settings']);
  });

  // UX-AI-09: "Anchor belongs inside Home, not in the bar."
  it('is always exactly four tabs — Anchor AI is not a destination (UX-AI-09)', () => {
    const items = buildBottomNavItems({ ...base });
    expect(items).toHaveLength(4);
    expect(items.find(i => i.to === '/fabric')).toBeUndefined();
  });

  it('retires the old Tasks alias', () => {
    const items = buildBottomNavItems({ ...base });
    expect(items.find(i => i.to === '/commitments')?.label).toBe('Commitments');
    expect(items.find(i => i.label === 'Tasks')).toBeUndefined();
  });

  it('always includes /settings so mobile users can reach sign-out, passkeys and Family Mode', () => {
    const items = buildBottomNavItems({ ...base });
    expect(items.find(i => i.to === '/settings')).toBeDefined();
  });

  it('each item has a label and renderIcon function', () => {
    const items = buildBottomNavItems({ ...base });
    items.forEach(item => {
      expect(item.label).toBeTruthy();
      expect(typeof item.renderIcon).toBe('function');
    });
  });

  // UX-GL-05: at most one low-noise dot, on Home, and no numeric badges.
  describe('nav state signalling (UX-GL-05)', () => {
    it('carries no dot when there is nothing unread', () => {
      const items = buildBottomNavItems({ ...base, hasUnreadInsight: false });
      expect(items.every(i => !i.dot)).toBe(true);
    });

    it('puts the dot on Home only when an insight is unread', () => {
      const items = buildBottomNavItems({ ...base, hasUnreadInsight: true });
      expect(items.filter(i => i.dot).map(i => i.to)).toEqual(['/dashboard']);
    });
  });
});

