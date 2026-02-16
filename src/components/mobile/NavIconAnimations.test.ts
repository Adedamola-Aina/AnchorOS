// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  navAnimationStyles,
  CELEBRATION_COLORS,
  getRandomColor,
  getAnimationClass,
} from './NavIconAnimations';

describe('NavIconAnimations', () => {
  describe('navAnimationStyles', () => {
    it('contains keyframes definitions', () => {
      expect(navAnimationStyles).toContain('@keyframes');
      expect(navAnimationStyles).toContain('nav-pulse');
      expect(navAnimationStyles).toContain('nav-bounce');
    });
  });

  describe('CELEBRATION_COLORS', () => {
    it('has 6 color entries', () => {
      expect(CELEBRATION_COLORS).toHaveLength(6);
    });

    it('each entry has light and dark properties', () => {
      CELEBRATION_COLORS.forEach(c => {
        expect(c).toHaveProperty('light');
        expect(c).toHaveProperty('dark');
      });
    });
  });

  describe('getRandomColor', () => {
    it('returns a color from CELEBRATION_COLORS', () => {
      const color = getRandomColor();
      expect(CELEBRATION_COLORS).toContainEqual(color);
    });
  });

  describe('getAnimationClass', () => {
    it('returns pulse for dashboard', () => {
      expect(getAnimationClass('/dashboard')).toContain('pulse');
    });

    it('returns bounce for commitments', () => {
      expect(getAnimationClass('/commitments')).toContain('bounce');
    });

    it('returns swipe for finance', () => {
      expect(getAnimationClass('/finance')).toContain('swipe');
    });

    it('returns rotate for settings', () => {
      expect(getAnimationClass('/settings')).toContain('rotate');
    });
  });
});
