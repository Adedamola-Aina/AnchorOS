// @ts-nocheck
const fs = require('fs');
const path = require('path');

const VELOCITY_DATA_PATH = path.join(__dirname, '../data/velocity.json');

// Initialize velocity data file if it doesn't exist
function initializeVelocityData() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(VELOCITY_DATA_PATH)) {
        const initialData = {
            completions: [],
            weeklyStats: []
        };
        fs.writeFileSync(VELOCITY_DATA_PATH, JSON.stringify(initialData, null, 2));
    }
}

// Read velocity data
function readVelocityData() {
    initializeVelocityData();
    const data = fs.readFileSync(VELOCITY_DATA_PATH, 'utf8');
    return JSON.parse(data);
}

// Write velocity data
function writeVelocityData(data) {
    fs.writeFileSync(VELOCITY_DATA_PATH, JSON.stringify(data, null, 2));
}

// Get week number in format "2026-W03"
function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// Record a completion
function recordCompletion(itemId, completedDate, startDate = null) {
    const data = readVelocityData();

    // Calculate cycle time if start date provided
    let cycleTime = null;
    if (startDate) {
        const start = new Date(startDate);
        const end = new Date(completedDate);
        cycleTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // days
    }

    // Add completion record
    const completion = {
        itemId,
        completedDate,
        cycleTime,
        recordedAt: new Date().toISOString()
    };

    data.completions.push(completion);

    // Update weekly stats
    const week = getWeekNumber(completedDate);
    let weekStat = data.weeklyStats.find(w => w.week === week);

    if (!weekStat) {
        weekStat = {
            week,
            completed: 0,
            velocity: 0
        };
        data.weeklyStats.push(weekStat);
    }

    weekStat.completed += 1;

    // Recalculate velocity (rolling 4-week average)
    const weekIndex = data.weeklyStats.findIndex(w => w.week === week);
    const last4Weeks = data.weeklyStats.slice(Math.max(0, weekIndex - 3), weekIndex + 1);
    const avgCompleted = last4Weeks.reduce((sum, w) => sum + w.completed, 0) / last4Weeks.length;
    weekStat.velocity = parseFloat(avgCompleted.toFixed(2));

    // Sort by week
    data.weeklyStats.sort((a, b) => a.week.localeCompare(b.week));

    writeVelocityData(data);
    return completion;
}

// Calculate current velocity (items per week)
function calculateVelocity(weeks = 4) {
    const data = readVelocityData();

    if (data.weeklyStats.length === 0) return 0;

    // Get last N weeks
    const recentWeeks = data.weeklyStats.slice(-weeks);
    const totalCompleted = recentWeeks.reduce((sum, w) => sum + w.completed, 0);
    const velocity = totalCompleted / recentWeeks.length;

    return parseFloat(velocity.toFixed(2));
}

// Calculate average cycle time
function calculateAverageCycleTime() {
    const data = readVelocityData();

    const completionsWithCycleTime = data.completions.filter(c => c.cycleTime !== null);

    if (completionsWithCycleTime.length === 0) return null;

    const totalCycleTime = completionsWithCycleTime.reduce((sum, c) => sum + c.cycleTime, 0);
    const avgCycleTime = totalCycleTime / completionsWithCycleTime.length;

    return parseFloat(avgCycleTime.toFixed(1));
}

// Predict completion date based on velocity
function predictCompletionDate(remainingItems) {
    const velocity = calculateVelocity();

    if (velocity === 0) return null;

    const weeksRemaining = remainingItems / velocity;
    const daysRemaining = Math.ceil(weeksRemaining * 7);

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysRemaining);

    return {
        date: completionDate.toISOString().split('T')[0],
        weeksRemaining: parseFloat(weeksRemaining.toFixed(1)),
        daysRemaining
    };
}

// Get velocity statistics
function getVelocityStats() {
    const data = readVelocityData();
    const velocity = calculateVelocity();
    const avgCycleTime = calculateAverageCycleTime();

    return {
        currentVelocity: velocity,
        averageCycleTime: avgCycleTime,
        totalCompletions: data.completions.length,
        weeklyStats: data.weeklyStats.slice(-12), // Last 12 weeks
        recentCompletions: data.completions.slice(-10) // Last 10 completions
    };
}

// Get historical data for charts
function getHistoricalData(weeks = 12) {
    const data = readVelocityData();
    return {
        weeklyStats: data.weeklyStats.slice(-weeks),
        completions: data.completions
    };
}

// Auto-detect completions from git-tracked deployed items (replaces ROADMAP.md parsing)
async function autoDetectCompletions() {
    const gitData = require('./gitDataProvider');
    const data = readVelocityData();
    const existingIds = new Set(data.completions.map(c => c.itemId));

    let newCompletions = 0;

    try {
        const items = await gitData.getAllTrackedItems(200);
        const deployedItems = items.filter(i => i.status === 'deployed');

        for (const item of deployedItems) {
            if (!existingIds.has(item.id)) {
                // Use the commit date as completion date
                const completedDate = item.date
                    ? new Date(item.date).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0];
                recordCompletion(item.id, completedDate);
                newCompletions++;
            }
        }
    } catch (error) {
        console.error('Error auto-detecting completions from git:', error.message);
    }

    return newCompletions;
}

module.exports = {
    recordCompletion,
    calculateVelocity,
    calculateAverageCycleTime,
    predictCompletionDate,
    getVelocityStats,
    getHistoricalData,
    autoDetectCompletions
};
