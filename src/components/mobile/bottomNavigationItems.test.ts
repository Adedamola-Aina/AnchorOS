import { describe, it, expect } from 'vitest';
import { buildBottomNavItems } from './bottomNavigationItems';

const base = { accountColors: [], isDarkMode: false };

describe('buildBottomNavItems', () => {
  it('returns 3 tabs without Anchor AI: Home, Tasks, Finance', () => {
    const items = buildBottomNavItems({ ...base, anchorAIEnabled: false });
    expect(items.map(i => i.to)).toEqual(['/dashboard', '/commitments', '/finance']);
    expect(items.find(i => i.to === '/settings')).toBeUndefined();
  });

  it('returns 4 tabs with Anchor AI: Home, Tasks, Anchor, Finance', () => {
    const items = buildBottomNavItems({ ...base, anchorAIEnabled: true });
    expect(items.map(i => i.to)).toEqual(['/dashboard', '/commitments', '/fabric', '/finance']);
  });

  it('never includes /settings regardless of anchorAIEnabled', () => {
    const withAI = buildBottomNavItems({ ...base, anchorAIEnabled: true });
    const withoutAI = buildBottomNavItems({ ...base, anchorAIEnabled: false });
    expect(withAI.find(i => i.to === '/settings')).toBeUndefined();
    expect(withoutAI.find(i => i.to === '/settings')).toBeUndefined();
  });

  it('each item has a label and renderIcon function', () => {
    const items = buildBottomNavItems({ ...base, anchorAIEnabled: true });
    items.forEach(item => {
      expect(item.label).toBeTruthy();
      expect(typeof item.renderIcon).toBe('function');
    });
  });
});
