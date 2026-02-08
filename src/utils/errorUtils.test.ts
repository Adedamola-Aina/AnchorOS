/**
 * Tests for errorUtils.ts — mapFirebaseError
 * Pure function, 14+ switch cases. Target: 100% coverage.
 */

import { describe, it, expect } from 'vitest';
import { mapFirebaseError } from './errorUtils';

describe('mapFirebaseError', () => {
    // ── Guard clauses ────────────────────────────────────────────────
    it('returns generic message for null input', () => {
        expect(mapFirebaseError(null)).toBe('An unknown error occurred.');
    });

    it('returns generic message for undefined input', () => {
        expect(mapFirebaseError(undefined)).toBe('An unknown error occurred.');
    });

    it('returns generic message for non-object input (string)', () => {
        expect(mapFirebaseError('some error string')).toBe('An unknown error occurred.');
    });

    it('returns generic message for non-object input (number)', () => {
        expect(mapFirebaseError(42)).toBe('An unknown error occurred.');
    });

    // ── Auth errors ──────────────────────────────────────────────────
    it('maps auth/network-request-failed', () => {
        expect(mapFirebaseError({ code: 'auth/network-request-failed' }))
            .toBe('Network error. Please check your internet connection.');
    });

    it('maps auth/user-not-found to incorrect credentials', () => {
        expect(mapFirebaseError({ code: 'auth/user-not-found' }))
            .toBe('Incorrect email or password.');
    });

    it('maps auth/wrong-password to incorrect credentials', () => {
        expect(mapFirebaseError({ code: 'auth/wrong-password' }))
            .toBe('Incorrect email or password.');
    });

    it('maps auth/invalid-credential to incorrect credentials', () => {
        expect(mapFirebaseError({ code: 'auth/invalid-credential' }))
            .toBe('Incorrect email or password.');
    });

    it('maps auth/email-already-in-use', () => {
        expect(mapFirebaseError({ code: 'auth/email-already-in-use' }))
            .toBe('This email is already registered. Try logging in.');
    });

    it('maps auth/weak-password', () => {
        expect(mapFirebaseError({ code: 'auth/weak-password' }))
            .toBe('Password should be at least 6 characters.');
    });

    it('maps auth/too-many-requests', () => {
        expect(mapFirebaseError({ code: 'auth/too-many-requests' }))
            .toBe('Too many attempts. Please try again later.');
    });

    it('maps auth/operation-not-allowed', () => {
        expect(mapFirebaseError({ code: 'auth/operation-not-allowed' }))
            .toBe('This sign-in method is not enabled. Please contact support.');
    });

    it('maps auth/quota-exceeded', () => {
        expect(mapFirebaseError({ code: 'auth/quota-exceeded' }))
            .toBe('Limit exceeded. Please check your usage or try again later.');
    });

    // ── Firestore operation errors (BUG-077) ────────────────────────
    it('maps permission-denied', () => {
        expect(mapFirebaseError({ code: 'permission-denied' }))
            .toBe('You do not have permission to perform this action.');
    });

    it('maps unavailable', () => {
        expect(mapFirebaseError({ code: 'unavailable' }))
            .toBe('Service temporarily unavailable. Please try again later.');
    });

    it('maps not-found', () => {
        expect(mapFirebaseError({ code: 'not-found' }))
            .toBe('The requested record was not found. It may have been deleted.');
    });

    it('maps already-exists', () => {
        expect(mapFirebaseError({ code: 'already-exists' }))
            .toBe('This record already exists. Please refresh and try again.');
    });

    it('maps deadline-exceeded', () => {
        expect(mapFirebaseError({ code: 'deadline-exceeded' }))
            .toBe('The operation timed out. Please check your connection and try again.');
    });

    it('maps aborted', () => {
        expect(mapFirebaseError({ code: 'aborted' }))
            .toBe('The operation was interrupted. Please try again.');
    });

    it('maps failed-precondition', () => {
        expect(mapFirebaseError({ code: 'failed-precondition' }))
            .toBe('This action cannot be completed right now. Please refresh and try again.');
    });

    // ── Default / fallback ──────────────────────────────────────────
    it('strips "Firebase: " prefix from unknown error messages', () => {
        expect(mapFirebaseError({ code: 'unknown', message: 'Firebase: Custom error text' }))
            .toBe('Custom error text');
    });

    it('returns raw message for unknown codes without Firebase prefix', () => {
        expect(mapFirebaseError({ code: 'unknown', message: 'Something specific happened' }))
            .toBe('Something specific happened');
    });

    it('returns generic fallback for unknown code with no message', () => {
        expect(mapFirebaseError({ code: 'unknown' }))
            .toBe('Something went wrong. Please try again.');
    });

    it('returns generic fallback for object with no code and no message', () => {
        expect(mapFirebaseError({}))
            .toBe('Something went wrong. Please try again.');
    });
});
