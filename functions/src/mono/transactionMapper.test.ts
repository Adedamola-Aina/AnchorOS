import { describe, it, expect } from 'vitest';
import {
  cleanNarration,
  autoCategorize,
  mapMonoTransaction,
  mapAndDeduplicate,
} from './transactionMapper';
import type { MonoTransaction } from './monoTypes';

// ---------------------------------------------------------------------------
// cleanNarration
// ---------------------------------------------------------------------------

describe('cleanNarration', () => {
  it('removes NIP/TRF/POS prefixes', () => {
    expect(cleanNarration('NIP TRF FROM JOHN DOE')).toBe('FROM JOHN DOE');
  });

  it('removes long account numbers', () => {
    expect(cleanNarration('Transfer from 0123456789 John')).toBe(
      'Transfer from John',
    );
  });

  it('returns fallback for empty narration', () => {
    expect(cleanNarration('   ')).toBe('Bank Transaction');
  });

  it('collapses multiple spaces', () => {
    expect(cleanNarration('POS   WEB   Purchase at Shoprite')).toBe(
      'Purchase at Shoprite',
    );
  });

  it('handles narration with only noise tokens', () => {
    expect(cleanNarration('NIP FT WEB')).toBe('Bank Transaction');
  });
});

// ---------------------------------------------------------------------------
// autoCategorize
// ---------------------------------------------------------------------------

describe('autoCategorize', () => {
  it('categorizes food merchants', () => {
    expect(autoCategorize('POS Purchase at Shoprite Lagos')).toBe('Food');
    expect(autoCategorize('Chicken Republic')).toBe('Food');
  });

  it('categorizes transport', () => {
    expect(autoCategorize('Uber trip payment')).toBe('Transport');
    expect(autoCategorize('Bolt ride')).toBe('Transport');
    expect(autoCategorize('Fuel station Oando')).toBe('Transport');
  });

  it('categorizes utilities', () => {
    expect(autoCategorize('MTN airtime recharge')).toBe('Utilities');
    expect(autoCategorize('DSTV subscription')).toBe('Utilities');
    expect(autoCategorize('IKEDC prepaid token')).toBe('Utilities');
  });

  it('categorizes salary', () => {
    expect(autoCategorize('SALARY FOR JANUARY 2026')).toBe('Salary');
    expect(autoCategorize('Payroll credit')).toBe('Salary');
  });

  it('categorizes investments', () => {
    expect(autoCategorize('PiggyVest savings')).toBe('Investments');
    expect(autoCategorize('Cowrywise fund')).toBe('Investments');
    expect(autoCategorize('Risevest portfolio')).toBe('Investments');
  });

  it('categorizes entertainment', () => {
    expect(autoCategorize('Netflix subscription')).toBe('Entertainment');
    expect(autoCategorize('Spotify premium')).toBe('Entertainment');
  });

  it('categorizes health', () => {
    expect(autoCategorize('Pharmacy purchase')).toBe('Health');
    expect(autoCategorize('Hospital bill payment')).toBe('Health');
  });

  it('categorizes education', () => {
    expect(autoCategorize('School fees payment')).toBe('Education');
    expect(autoCategorize('Udemy course purchase')).toBe('Education');
  });

  it('categorizes housing', () => {
    expect(autoCategorize('Rent payment to landlord')).toBe('Housing');
  });

  it('categorizes shopping', () => {
    expect(autoCategorize('Jumia order payment')).toBe('Shopping');
    expect(autoCategorize('Amazon purchase')).toBe('Shopping');
  });

  it('categorizes personal care', () => {
    expect(autoCategorize('Salon haircut')).toBe('Personal Care');
    expect(autoCategorize('Gym membership')).toBe('Personal Care');
  });

  it('categorizes travel', () => {
    expect(autoCategorize('Flight booking Arik Air')).toBe('Travel');
    expect(autoCategorize('Airbnb reservation')).toBe('Travel');
  });

  it('falls back to General', () => {
    expect(autoCategorize('Random unknown narration')).toBe('General');
  });
});

// ---------------------------------------------------------------------------
// mapMonoTransaction
// ---------------------------------------------------------------------------

describe('mapMonoTransaction', () => {
  const baseTx: MonoTransaction = {
    _id: 'mono_tx_001',
    type: 'debit',
    amount: 15000,
    narration: 'POS Purchase at Shoprite Lagos',
    date: '2026-01-15T10:30:00Z',
    balance: 250000,
    currency: 'NGN',
  };

  it('maps debit to expense', () => {
    const result = mapMonoTransaction(baseTx, 'acc_123', 'NGN');
    expect(result.type).toBe('expense');
    expect(result.amountCents).toBe(1500000);
    expect(result.category).toBe('Food');
    expect(result.source).toBe('synced');
    expect(result.externalTransactionId).toBe('mono_tx_001');
    expect(result.scope).toBe('personal');
  });

  it('maps credit to income', () => {
    const creditTx: MonoTransaction = {
      ...baseTx,
      type: 'credit',
      narration: 'SALARY FOR JANUARY',
    };
    const result = mapMonoTransaction(creditTx, 'acc_123', 'NGN');
    expect(result.type).toBe('income');
    expect(result.category).toBe('Salary');
  });

  it('always uses absolute amount', () => {
    const negativeTx: MonoTransaction = { ...baseTx, amount: -5000 };
    const result = mapMonoTransaction(negativeTx, 'acc_123', 'NGN');
    expect(result.amountCents).toBe(500000);
  });

  it('preserves original narration', () => {
    const result = mapMonoTransaction(baseTx, 'acc_123', 'NGN');
    expect(result.narration).toBe('POS Purchase at Shoprite Lagos');
    expect(result.title).not.toContain('POS');
  });

  it('uses the correct currency', () => {
    const result = mapMonoTransaction(baseTx, 'acc_123', 'USD');
    expect(result.currency).toBe('USD');
  });
});

// ---------------------------------------------------------------------------
// mapAndDeduplicate
// ---------------------------------------------------------------------------

describe('mapAndDeduplicate', () => {
  const transactions: MonoTransaction[] = [
    {
      _id: 'tx_1',
      type: 'debit',
      amount: 100,
      narration: 'Test 1',
      date: '2026-01-01',
      balance: 900,
      currency: 'NGN',
    },
    {
      _id: 'tx_2',
      type: 'credit',
      amount: 200,
      narration: 'Test 2',
      date: '2026-01-02',
      balance: 1100,
      currency: 'NGN',
    },
    {
      _id: 'tx_3',
      type: 'debit',
      amount: 50,
      narration: 'Test 3',
      date: '2026-01-03',
      balance: 1050,
      currency: 'NGN',
    },
  ];

  it('filters out existing external IDs', () => {
    const existing = new Set(['tx_1', 'tx_3']);
    const result = mapAndDeduplicate(transactions, 'acc_1', 'NGN', existing);
    expect(result).toHaveLength(1);
    expect(result[0].externalTransactionId).toBe('tx_2');
  });

  it('returns all when no existing IDs', () => {
    const result = mapAndDeduplicate(
      transactions,
      'acc_1',
      'NGN',
      new Set(),
    );
    expect(result).toHaveLength(3);
  });

  it('returns empty array when all are duplicates', () => {
    const existing = new Set(['tx_1', 'tx_2', 'tx_3']);
    const result = mapAndDeduplicate(transactions, 'acc_1', 'NGN', existing);
    expect(result).toHaveLength(0);
  });

  it('handles empty input array', () => {
    const result = mapAndDeduplicate([], 'acc_1', 'NGN', new Set());
    expect(result).toHaveLength(0);
  });
});
