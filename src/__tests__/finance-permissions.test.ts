import { describe, expect, it } from 'vitest';
import {
  canAddTransaction,
  canDeleteTransaction,
  canEditTransaction,
  canManageAccount,
  canViewAccount,
  getAccountPermission,
} from '../services/financePermissions';
import type { AnchorAccount } from '../types';

/**
 * Tier-1 typing prerequisite (Wave 1 B1): guards the client-side permission
 * contract for `src/services/financePermissions.ts` now that the file is
 * fully typed. Client checks are cosmetic; server rules/functions are authoritative.
 */

function account(overrides: Partial<AnchorAccount> = {}): AnchorAccount {
  return {
    id: 'acc1',
    name: 'Account',
    type: 'checking',
    currency: 'NGN',
    balanceCents: 0,
    color: '#000000',
    scope: 'personal',
    ...overrides,
  };
}

describe('finance permissions contract', () => {
  it('owner retains full permissions', () => {
    const acc = account({ ownerId: 'u1' });
    expect(getAccountPermission(acc, 'u1')).toBe('owner');
    expect(canViewAccount(acc, 'u1')).toBe(true);
    expect(canAddTransaction(acc, 'u1')).toBe(true);
    expect(canManageAccount(acc, 'u1')).toBe(true);
  });

  it('modern sharedWith grant takes priority and is honored', () => {
    const acc = account({
      ownerId: 'u1',
      sharedWith: { u2: { grantedAt: '2026-01-01', grantedBy: 'u1', permission: 'transact' } },
      shares: { u2: 'manage' }, // legacy must NOT override the V2 grant
    });
    expect(getAccountPermission(acc, 'u2')).toBe('transact');
    expect(canAddTransaction(acc, 'u2')).toBe(true);
    expect(canManageAccount(acc, 'u2')).toBe(false);
  });

  it('sharedWith entry without explicit permission defaults to read', () => {
    const acc = account({
      ownerId: 'u1',
      sharedWith: { u2: { grantedAt: '2026-01-01', grantedBy: 'u1' } },
    });
    expect(getAccountPermission(acc, 'u2')).toBe('read');
    expect(canViewAccount(acc, 'u2')).toBe(true);
    expect(canAddTransaction(acc, 'u2')).toBe(false);
    expect(canEditTransaction(acc, 'u2')).toBe(false);
    expect(canDeleteTransaction(acc, 'u2')).toBe(false);
  });

  it('unrelated user has no permissions', () => {
    const acc = account({ ownerId: 'u1' });
    expect(getAccountPermission(acc, 'stranger')).toBe(null);
    expect(canViewAccount(acc, 'stranger')).toBe(false);
    expect(canAddTransaction(acc, 'stranger')).toBe(false);
  });
});
