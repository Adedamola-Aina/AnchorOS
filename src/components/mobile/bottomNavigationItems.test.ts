import { describe, it, expect } from 'vitest';
import { buildBottomNavItems } from './bottomNavigationItems';

const base = { accountColors: [], isDarkMode: false };

describe('buildBottomNavItems', () => {
  it('returns 4 tabs without Anchor AI: Home, Tasks, Finance, Settings', () => {
    const items = buildBottomNavItems({ ...base, anchorAIEnabled: false });
    expect(items.map(i => i.to)).toEqual(['/dashboard', '/commitments', '/finance', '/settings']);
  });

  it('returns 5 tabs with Anchor AI: Home, Tasks, Anchor, Finance, Settings', () => {
    const items = buildBottomNavItems({ ...base, anchorAIEnabled: true });
    expect(items.map(i => i.to)).toEqual(['/dashboard', '/commitments', '/fabric', '/finance', '/settings']);
  });

  it('always includes /settings so mobile users can reach sign-out, passkeys and Family Mode', () => {
    const withAI = buildBottomNavItems({ ...base, anchorAIEnabled: true });
    const withoutAI = buildBottomNavItems({ ...base, anchorAIEnabled: false });
    expect(withAI.find(i => i.to === '/settings')).toBeDefined();
    expect(withoutAI.find(i => i.to === '/settings')).toBeDefined();
  });

  it('each item has a label and renderIcon function', () => {
    const items = buildBottomNavItems({ ...base, anchorAIEnabled: true });
    items.forEach(item => {
      expect(item.label).toBeTruthy();
      expect(typeof item.renderIcon).toBe('function');
    });
  });
});
