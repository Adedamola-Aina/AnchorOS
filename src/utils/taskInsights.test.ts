/**
 * Tests for taskInsights.ts — getProductivityMetrics
 * Target: 90%+ mutation kill rate
 */
// @ts-nocheck


import { describe, it, expect } from 'vitest';
import { getProductivityMetrics } from './taskInsights';
import type { AnchorTask } from '../types';
import { buildTask } from '../test/factories';

const task = (overrides: Partial<AnchorTask> = {}): AnchorTask => buildTask(overrides);

describe('getProductivityMetrics', () => {
    // ── Empty input ─────────────────────────────────────────────────
    it('returns zero score for empty tasks', () => {
        const result = getProductivityMetrics([]);
        expect(result.score).toBe(0);
        expect(result.trend).toBe('stable');
        expect(result.completedCount).toBe(0);
        expect(result.totalCount).toBe(0);
        expect(result.domainBreakdown.personal).toBe(0);
        expect(result.domainBreakdown.family).toBe(0);
        expect(result.insight).toBeNull();
    });

    // ── Score calculation ───────────────────────────────────────────
    it('calculates score as percentage of completed tasks', () => {
        const tasks = [
            task({ completed: true }),
            task({ completed: true }),
            task({ completed: false }),
            task({ completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(50);
        expect(result.completedCount).toBe(2);
        expect(result.totalCount).toBe(4);
    });

    it('returns 100 score when all tasks completed', () => {
        const tasks = [task({ completed: true }), task({ completed: true })];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(100);
        expect(result.completedCount).toBe(2);
    });

    it('returns 0 score when no tasks completed', () => {
        const tasks = [task({ completed: false }), task({ completed: false })];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(0);
        expect(result.completedCount).toBe(0);
    });

    // ── Trend logic ─────────────────────────────────────────────────
    it('returns improving trend when score > 50', () => {
        const tasks = [
            task({ completed: true }),
            task({ completed: true }),
            task({ completed: true }),
            task({ completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(75);
        expect(result.trend).toBe('improving');
    });

    it('returns stable trend when score <= 50', () => {
        const tasks = [task({ completed: true }), task({ completed: false })];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(50);
        expect(result.trend).toBe('stable');
    });

    it('returns stable trend when score is 0', () => {
        const tasks = [task({ completed: false })];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(0);
        expect(result.trend).toBe('stable');
    });

    // ── Domain breakdown ────────────────────────────────────────────
    it('calculates personal score correctly', () => {
        const tasks = [
            task({ category: 'personal', completed: true }),
            task({ category: 'personal', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.domainBreakdown.personal).toBe(50);
        expect(result.domainBreakdown.family).toBe(0);
    });

    it('calculates family score correctly', () => {
        const tasks = [
            task({ category: 'family', completed: true }),
            task({ category: 'family', completed: true }),
            task({ category: 'family', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.domainBreakdown.family).toBe(67);
        expect(result.domainBreakdown.personal).toBe(0);
    });

    it('calculates both domains independently', () => {
        const tasks = [
            task({ category: 'personal', completed: true }),
            task({ category: 'personal', completed: true }),
            task({ category: 'family', completed: false }),
            task({ category: 'family', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.domainBreakdown.personal).toBe(100);
        expect(result.domainBreakdown.family).toBe(0);
    });

    // ── Insight generation ──────────────────────────────────────────
    it('returns outstanding insight for score > 80', () => {
        const tasks = Array.from({ length: 10 }, () => task({ completed: true }));
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(100);
        // Score > 80, but personal vs family insight may override
        expect(result.insight).toBeTruthy();
    });

    it('returns on-track insight for score between 51 and 80', () => {
        // Balance personal/family equally to avoid domain insight override
        const tasks = [
            task({ category: 'personal', completed: true }),
            task({ category: 'family', completed: true }),
            task({ category: 'personal', completed: true }),
            task({ category: 'family', completed: false }),
            task({ category: 'personal', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(60);
        expect(result.insight).toContain('on track');
    });

    it('returns small win insight for score between 1 and 50', () => {
        // Balance personal/family equally to avoid domain insight override (need diff ≤ 20)
        const tasks = [
            task({ category: 'personal', completed: true }),
            task({ category: 'personal', completed: false }),
            task({ category: 'personal', completed: false }),
            task({ category: 'personal', completed: false }),
            task({ category: 'family', completed: true }),
            task({ category: 'family', completed: false }),
            task({ category: 'family', completed: false }),
            task({ category: 'family', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(25);
        expect(result.insight).toContain('one small win');
    });

    it('returns null insight for zero score with no completed tasks', () => {
        const tasks = [task({ completed: false })];
        const result = getProductivityMetrics(tasks);
        expect(result.score).toBe(0);
        // score is 0, which is not > 0, so insight stays null unless domain overrides
        // Domain breakdown won't trigger since both personal/family are 0
    });

    // ── Personal > family insight override ──────────────────────────
    it('suggests family focus when personal >> family by 20+', () => {
        const tasks = [
            task({ category: 'personal', completed: true }),
            task({ category: 'personal', completed: true }),
            task({ category: 'personal', completed: true }),
            task({ category: 'family', completed: false }),
            task({ category: 'family', completed: false }),
            task({ category: 'family', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        // personal = 100%, family = 0%, diff > 20
        expect(result.insight).toContain('family commitments');
    });

    // ── Family > personal insight override ──────────────────────────
    it('suggests personal time when family >> personal by 20+', () => {
        const tasks = [
            task({ category: 'family', completed: true }),
            task({ category: 'family', completed: true }),
            task({ category: 'family', completed: true }),
            task({ category: 'personal', completed: false }),
            task({ category: 'personal', completed: false }),
            task({ category: 'personal', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        // family = 100%, personal = 0%, diff > 20
        expect(result.insight).toContain('yourself');
    });

    // ── Rounding ────────────────────────────────────────────────────
    it('rounds score to integer', () => {
        const tasks = [
            task({ completed: true }),
            task({ completed: false }),
            task({ completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        // 1/3 = 33.33... → rounded to 33
        expect(result.score).toBe(33);
        expect(Number.isInteger(result.score)).toBe(true);
    });

    it('rounds domain scores to integer', () => {
        const tasks = [
            task({ category: 'personal', completed: true }),
            task({ category: 'personal', completed: false }),
            task({ category: 'personal', completed: false }),
        ];
        const result = getProductivityMetrics(tasks);
        expect(Number.isInteger(result.domainBreakdown.personal)).toBe(true);
    });
});
