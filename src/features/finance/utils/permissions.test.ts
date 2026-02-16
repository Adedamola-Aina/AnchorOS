// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  getAccountPermission,
  canViewAccount,
  canAddTransaction,
  canEditTransaction,
  canDeleteTransaction,
  canManageAccount,
} from './permissions';

describe('permissions', () => {
  const ownerAccount = {
    id: 'acc-1',
    ownerId: 'user-1',
    sharedWith: {
      'user-2': { permission: 'read' as const },
      'user-3': { permission: 'transact' as const },
      'user-4': { permission: 'manage' as const },
    },
  } as any;

  describe('getAccountPermission', () => {
    it('returns null for no userId', () => {
      expect(getAccountPermission(ownerAccount, '')).toBeNull();
    });

    it('returns owner for the owner', () => {
      expect(getAccountPermission(ownerAccount, 'user-1')).toBe('owner');
    });

    it('returns read for read-shared user', () => {
      expect(getAccountPermission(ownerAccount, 'user-2')).toBe('read');
    });

    it('returns transact for transact-shared user', () => {
      expect(getAccountPermission(ownerAccount, 'user-3')).toBe('transact');
    });

    it('returns manage for manage-shared user', () => {
      expect(getAccountPermission(ownerAccount, 'user-4')).toBe('manage');
    });

    it('returns null for unknown user', () => {
      expect(getAccountPermission(ownerAccount, 'user-999')).toBeNull();
    });
  });

  describe('canViewAccount', () => {
    it('returns true for owner', () => {
      expect(canViewAccount(ownerAccount, 'user-1')).toBe(true);
    });

    it('returns true for read-shared user', () => {
      expect(canViewAccount(ownerAccount, 'user-2')).toBe(true);
    });

    it('returns false for unknown user', () => {
      expect(canViewAccount(ownerAccount, 'user-999')).toBe(false);
    });
  });

  describe('canAddTransaction', () => {
    it('returns true for owner', () => {
      expect(canAddTransaction(ownerAccount, 'user-1')).toBe(true);
    });

    it('returns false for read-only user', () => {
      expect(canAddTransaction(ownerAccount, 'user-2')).toBe(false);
    });

    it('returns true for transact user', () => {
      expect(canAddTransaction(ownerAccount, 'user-3')).toBe(true);
    });

    it('returns true for manage user', () => {
      expect(canAddTransaction(ownerAccount, 'user-4')).toBe(true);
    });
  });

  describe('canEditTransaction', () => {
    it('returns true for owner', () => {
      expect(canEditTransaction(ownerAccount, 'user-1')).toBe(true);
    });

    it('returns false for read-only', () => {
      expect(canEditTransaction(ownerAccount, 'user-2')).toBe(false);
    });

    it('returns false for transact', () => {
      expect(canEditTransaction(ownerAccount, 'user-3')).toBe(false);
    });

    it('returns true for manage', () => {
      expect(canEditTransaction(ownerAccount, 'user-4')).toBe(true);
    });
  });

  describe('canDeleteTransaction', () => {
    it('returns true for owner', () => {
      expect(canDeleteTransaction(ownerAccount, 'user-1')).toBe(true);
    });

    it('returns true for transact user', () => {
      expect(canDeleteTransaction(ownerAccount, 'user-3')).toBe(true);
    });

    it('returns true for manage user', () => {
      expect(canDeleteTransaction(ownerAccount, 'user-4')).toBe(true);
    });
  });

  describe('canManageAccount', () => {
    it('returns true for owner', () => {
      expect(canManageAccount(ownerAccount, 'user-1')).toBe(true);
    });

    it('returns false for read-only', () => {
      expect(canManageAccount(ownerAccount, 'user-2')).toBe(false);
    });

    it('returns true for manage', () => {
      expect(canManageAccount(ownerAccount, 'user-4')).toBe(true);
    });
  });
});
