// @ts-nocheck
const fs = require('fs');
const path = require('path');

const VELOCITY_DATA_PATH = path.join(__dirname, '../data/velocity.json');
const MIN_WEEKS_FOR_VELOCITY = 2; // Don't show velocity until we have real data

function initializeVelocityData() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(VELOCITY_DATA_PATH)) {
        fs.writeFileSync(VELOCITY_DATA_PATH, JSON.stringify({ completions: [], weeklyStats: [] }, null, 2));
    }
}

function readVelocityData() {
    initializeVelocityData();
    return JSON.parse(fs.readFileSync(VELOCITY_DATA_PATH, 'utf8'));
}

function writeVelocityData(data) {
    fs.writeFileSync(VELOCITY_DATA_PATH, JSON.stringify(data, null, 2));
}

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function recordCompletion(itemId, completedDate, startDate = null) {
    const data = readVelocityData();
    const cycleTime = (startDate && completedDate)
        ? Math.ceil((new Date(completedDate) - new Date(startDate)) / 86400000)
        : null;

    data.completions.push({ itemId, completedDate, cycleTime, recordedAt: new Date().toISOString() });

    const week = getWeekNumber(completedDate);
    let weekStat = data.weeklyStats.find(w => w.week === week);
    if (!weekStat) {
        weekStat = { week, completed: 0, velocity: 0 };
        data.weeklyStats.push(weekStat);
    }
    weekStat.completed += 1;

    const idx = data.weeklyStats.findIndex(w => w.week === week);
    const last4 = data.weeklyStats.slice(Math.max(0, idx - 3), idx + 1);
    weekStat.velocity = parseFloat((last4.reduce((s, w) => s + w.completed, 0) / last4.length).toFixed(2));
    data.weeklyStats.sort((a, b) => a.week.localeCompare(b.week));

    writeVelocityData(data);
    return { itemId, completedDate, cycleTime };
}

function calculateVelocity(weeks = 4) {
    const data = readVelocityData();
    if (data.weeklyStats.length < MIN_WEEKS_FOR_VELOCITY) return null; // Insufficient data
    const recent = data.weeklyStats.slice(-weeks);
    return parseFloat((recent.reduce((s, w) => s + w.completed, 0) / recent.length).toFixed(2));
}

function calculateAverageCycleTime() {
    const data = readVelocityData();
    const withTime = data.completions.filter(c => c.cycleTime !== null);
    if (withTime.length === 0) return null;
    return parseFloat((withTime.reduce((s, c) => s + c.cycleTime, 0) / withTime.length).toFixed(1));
}

function predictCompletionDate(remainingItems) {
    const velocity = calculateVelocity();
    if (!velocity || velocity === 0) return null;
    const daysRemaining = Math.ceil((remainingItems / velocity) * 7);
    const date = new Date();
    date.setDate(date.getDate() + daysRemaining);
    return {
        date: date.toISOString().split('T')[0],
        weeksRemaining: parseFloat((remainingItems / velocity).toFixed(1)),
        daysRemaining
    };
}

function getVelocityStats() {
    const data = readVelocityData();
    const velocity = calculateVelocity();
    return {
        currentVelocity: velocity,
        sufficientData: velocity !== null,
        averageCycleTime: calculateAverageCycleTime(),
        totalCompletions: data.completions.length,
        weeklyStats: data.weeklyStats.slice(-12),
        recentCompletions: data.completions.slice(-10)
    };
}

function getHistoricalData(weeks = 12) {
    const data = readVelocityData();
    return { weeklyStats: data.weeklyStats.slice(-weeks), completions: data.completions };
}

/**
 * Auto-detect completions from git-deployed items.
 * Only records items deployed AFTER the last recorded completion date
 * to prevent re-hydrating already-counted items on every run.
 */
async function autoDetectCompletions() {
    const gitData = require('./gitDataProvider');
    const data = readVelocityData();
    const existingIds = new Set(data.completions.map(c => c.itemId));

    // Cutoff: only record items deployed after this date (prevents bulk re-load)
    const lastRecorded = data.completions.length > 0
        ? data.completions.reduce((max, c) => c.recordedAt > max ? c.recordedAt : max, '')
        : null;

    let newCompletions = 0;
    try {
        const items = await gitData.getAllTrackedItems(200);
        for (const item of items.filter(i => i.status === 'deployed')) {
            if (existingIds.has(item.id)) continue;
            // Skip items committed before we started tracking (retroactive bulk-load guard)
            if (lastRecorded && item.date && new Date(item.date).toISOString() < lastRecorded) continue;
            const completedDate = item.date
                ? new Date(item.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            recordCompletion(item.id, completedDate);
            newCompletions++;
        }
    } catch (err) {
        console.error('[velocityTracker] autoDetectCompletions error:', err.message);
    }
    return newCompletions;
}

module.exports = {
    recordCompletion, calculateVelocity, calculateAverageCycleTime,
    predictCompletionDate, getVelocityStats, getHistoricalData, autoDetectCompletions
};
