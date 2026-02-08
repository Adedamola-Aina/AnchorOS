import { describe, it, expect } from 'vitest';
import { getNotificationIcon, getNotificationBgColor, getNotificationIconColor } from './notificationStyles';
import { Users, Bell } from 'lucide-react';

describe('notificationStyles', () => {
  describe('getNotificationIcon', () => {
    it('returns Users for family_connected', () => {
      expect(getNotificationIcon('family_connected')).toBe(Users);
    });
    it('returns Users for invitation_accepted', () => {
      expect(getNotificationIcon('invitation_accepted')).toBe(Users);
    });
    it('returns Users for account_shared', () => {
      expect(getNotificationIcon('account_shared')).toBe(Users);
    });
    it('returns Bell for unknown types', () => {
      expect(getNotificationIcon('unknown_type')).toBe(Bell);
    });
  });

  describe('getNotificationBgColor', () => {
    it('returns emerald for family_connected', () => {
      expect(getNotificationBgColor('family_connected')).toContain('emerald');
    });
    it('returns amber for account_shared', () => {
      expect(getNotificationBgColor('account_shared')).toContain('amber');
    });
    it('returns family for invitation_accepted', () => {
      expect(getNotificationBgColor('invitation_accepted')).toContain('family');
    });
    it('returns slate for unknown types', () => {
      expect(getNotificationBgColor('other')).toContain('slate');
    });
  });

  describe('getNotificationIconColor', () => {
    it('returns emerald for family_connected', () => {
      expect(getNotificationIconColor('family_connected')).toContain('emerald');
    });
    it('returns amber for account_shared', () => {
      expect(getNotificationIconColor('account_shared')).toContain('amber');
    });
    it('returns family for invitation_accepted', () => {
      expect(getNotificationIconColor('invitation_accepted')).toContain('family');
    });
    it('returns slate for unknown types', () => {
      expect(getNotificationIconColor('other')).toContain('slate');
    });
  });
});
