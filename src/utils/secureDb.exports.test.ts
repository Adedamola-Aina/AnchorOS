import { describe, expect, it } from 'vitest';
import { collection, doc, increment, query, runTransaction, writeBatch } from './secureDb';

describe('secureDb exports', () => {
  it('re-exports firestore primitives used by callers', () => {
    expect(typeof collection).toBe('function');
    expect(typeof doc).toBe('function');
    expect(typeof increment).toBe('function');
    expect(typeof query).toBe('function');
    expect(typeof runTransaction).toBe('function');
    expect(typeof writeBatch).toBe('function');
  });
});
