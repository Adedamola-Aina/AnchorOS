import { describe, it, expect } from 'vitest';
import {
  createActivityEntry,
  formatActivityMessage,
  getActivityIcon,
  getActivityColor,
  type AccountActivity,
} from './activity';

describe('activity', () => {
  describe('createActivityEntry', () => {
    it('creates an entry with correct fields', () => {
      const entry = createActivityEntry('transaction_added', 'acc1', 'owner1', 'actor1', 'Sarah', { transactionTitle: 'Groceries' });
      expect(entry.action).toBe('transaction_added');
      expect(entry.accountId).toBe('acc1');
      expect(entry.accountOwnerId).toBe('owner1');
      expect(entry.actorId).toBe('actor1');
      expect(entry.actorName).toBe('Sarah');
      expect(entry.details.transactionTitle).toBe('Groceries');
      expect(entry.timestamp).toBeDefined();
    });
  });

  describe('formatActivityMessage', () => {
    const base: AccountActivity = {
      id: '1', accountId: 'a1', accountOwnerId: 'o1', actorId: 'u1', actorName: 'Sarah',
      action: 'transaction_added', timestamp: new Date().toISOString(), details: {},
    };

    it('formats transaction_added', () => {
      expect(formatActivityMessage({ ...base, action: 'transaction_added', details: { transactionTitle: 'Rent' } }))
        .toBe('Sarah added "Rent"');
    });

    it('formats transaction_edited with title change', () => {
      expect(formatActivityMessage({ ...base, action: 'transaction_edited', details: { previousTitle: 'Old', transactionTitle: 'New' } }))
        .toBe('Sarah renamed "Old" to "New"');
    });

    it('formats transaction_edited with amount change', () => {
      expect(formatActivityMessage({ ...base, action: 'transaction_edited', details: { transactionTitle: 'Tx', previousAmountCents: 100, amountCents: 200 } }))
        .toBe('Sarah updated amount on "Tx"');
    });

    it('formats generic transaction_edited', () => {
      expect(formatActivityMessage({ ...base, action: 'transaction_edited', details: { transactionTitle: 'Tx' } }))
        .toBe('Sarah edited "Tx"');
    });

    it('formats transaction_deleted', () => {
      expect(formatActivityMessage({ ...base, action: 'transaction_deleted', details: { transactionTitle: 'Item' } }))
        .toBe('Sarah deleted "Item"');
    });

    it('formats account_renamed', () => {
      expect(formatActivityMessage({ ...base, action: 'account_renamed', details: { oldName: 'A', newName: 'B' } }))
        .toBe('Sarah renamed account from "A" to "B"');
    });

    it('formats account_shared', () => {
      expect(formatActivityMessage({ ...base, action: 'account_shared', details: { sharedWithName: 'John' } }))
        .toBe('Sarah shared this account with John');
    });

    it('formats account_unshared', () => {
      expect(formatActivityMessage({ ...base, action: 'account_unshared', details: { sharedWithName: 'John' } }))
        .toBe('Sarah stopped sharing with John');
    });

    it('handles unknown action', () => {
      expect(formatActivityMessage({ ...base, action: 'unknown' as any, details: {} }))
        .toBe('Sarah performed an action');
    });
  });

  describe('getActivityIcon', () => {
    it('returns correct icons for each action', () => {
      expect(getActivityIcon('transaction_added')).toBe('plus-circle');
      expect(getActivityIcon('transaction_edited')).toBe('pencil');
      expect(getActivityIcon('transaction_deleted')).toBe('trash-2');
      expect(getActivityIcon('account_renamed')).toBe('type');
      expect(getActivityIcon('account_shared')).toBe('user-plus');
      expect(getActivityIcon('account_unshared')).toBe('user-minus');
      expect(getActivityIcon('unknown' as any)).toBe('activity');
    });
  });

  describe('getActivityColor', () => {
    it('returns correct colors for each action', () => {
      expect(getActivityColor('transaction_added')).toContain('emerald');
      expect(getActivityColor('transaction_edited')).toContain('primary');
      expect(getActivityColor('transaction_deleted')).toContain('rose');
      expect(getActivityColor('account_renamed')).toContain('amber');
      expect(getActivityColor('account_shared')).toContain('primary');
      expect(getActivityColor('account_unshared')).toContain('slate');
      expect(getActivityColor('unknown' as any)).toContain('slate');
    });
  });
});
