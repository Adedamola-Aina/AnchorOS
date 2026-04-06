import { describe, it, expect } from 'vitest';
import { parseTransaction } from './transactionParser';

describe('parseTransaction', () => {
  describe('amount parsing', () => {
    it('parses dollar amounts with $ prefix', () => {
      const result = parseTransaction('Spent $50 on groceries');
      expect(result.amount).toBe(50);
    });

    it('parses naira amounts with ₦ prefix', () => {
      const result = parseTransaction('Paid ₦2,500 for transport');
      expect(result.amount).toBe(2500);
    });

    it('parses amounts with currency suffix', () => {
      const result = parseTransaction('500 naira for food');
      expect(result.amount).toBe(500);
    });

    it('parses plain numeric amounts', () => {
      const result = parseTransaction('Spent 1500 on shopping');
      expect(result.amount).toBe(1500);
    });

    it('returns undefined amount when no number present', () => {
      const result = parseTransaction('bought groceries');
      expect(result.amount).toBeUndefined();
    });
  });

  describe('category detection', () => {
    it('detects groceries category', () => {
      const result = parseTransaction('Spent $50 on groceries');
      expect(result.category).toBe('Groceries');
    });

    it('detects transportation category', () => {
      const result = parseTransaction('Uber ride 1500');
      expect(result.category).toBe('Transportation');
    });

    it('detects health category', () => {
      const result = parseTransaction('Doctor visit $200');
      expect(result.category).toBe('Health');
    });

    it('detects subscriptions', () => {
      const result = parseTransaction('Netflix subscription 5000');
      expect(result.category).toBe('Subscriptions');
    });

    it('falls back to extracted description when no category matches', () => {
      const result = parseTransaction('Paid 300 for haircut');
      expect(result.title?.toLowerCase()).toContain('haircut');
    });
  });

  describe('date parsing', () => {
    it('parses "yesterday"', () => {
      const result = parseTransaction('Spent $50 on groceries yesterday');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(result.date).toBe(yesterday.toISOString().split('T')[0]);
    });

    it('parses "today"', () => {
      const result = parseTransaction('Bought food today $20');
      expect(result.date).toBe(new Date().toISOString().split('T')[0]);
    });

    it('returns undefined date when no time reference', () => {
      const result = parseTransaction('Spent $50 on groceries');
      expect(result.date).toBeUndefined();
    });
  });

  describe('title extraction', () => {
    it('extracts meaningful title from input', () => {
      const result = parseTransaction('Spent $50 on groceries yesterday');
      expect(result.title).toBeDefined();
      expect(result.title!.length).toBeGreaterThan(0);
    });

    it('uses category-related words when available', () => {
      const result = parseTransaction('Uber ride to work 1500');
      expect(result.title).toBeDefined();
    });

    it('handles empty input gracefully', () => {
      const result = parseTransaction('');
      expect(result.amount).toBeUndefined();
      expect(result.category).toBeUndefined();
      expect(result.title).toBeUndefined();
    });
  });

  describe('full parsing integration', () => {
    it('parses "Spent 500 on groceries yesterday"', () => {
      const result = parseTransaction('Spent 500 on groceries yesterday');
      expect(result.amount).toBe(500);
      expect(result.category).toBe('Groceries');
      expect(result.date).toBeDefined();
    });

    it('parses "₦3000 uber ride"', () => {
      const result = parseTransaction('₦3000 uber ride');
      expect(result.amount).toBe(3000);
      expect(result.category).toBe('Transportation');
    });

    it('parses "$25 netflix"', () => {
      const result = parseTransaction('$25 netflix');
      expect(result.amount).toBe(25);
      expect(result.category).toBe('Subscriptions');
    });

    it('parses "rent 150000 naira"', () => {
      const result = parseTransaction('rent 150000 naira');
      expect(result.amount).toBe(150000);
      expect(result.category).toBe('Rent');
    });
  });
});
