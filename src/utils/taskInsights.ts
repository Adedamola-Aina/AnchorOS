
import type { AnchorTask } from '../types';

interface ProductivityMetrics {
    score: number; // 0-100 percentage
    trend: 'improving' | 'declining' | 'stable';
    completedCount: number;
    totalCount: number;
    domainBreakdown: {
        personal: number; // percent
        family: number; // percent
    };
    insight: string | null;
}

export const getProductivityMetrics = (tasks: AnchorTask[]): ProductivityMetrics => {
    // In a real app with history, we'd query "TaskCompletions" collection.
    // Here, we only have the current state of tasks. 
    // Heuristic: We can't easily calculate "trend" without history logs.
    // However, if we assume 'completed' tasks effectively represent recent activity (or resets), 
    // we can calculate a simplified "current state" score.

    // For the sake of the "Life at a Glance" UI, we will calculate based on:
    // Standing Commitments (Daily/Weekly) vs Completion status.

    if (tasks.length === 0) {
        return {
            score: 0,
            trend: 'stable',
            completedCount: 0,
            totalCount: 0,
            domainBreakdown: { personal: 0, family: 0 },
            insight: null
        };
    }

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const score = Math.round((completed / total) * 100);

    // Domain Split
    const personalTasks = tasks.filter(t => t.category === 'personal');
    const familyTasks = tasks.filter(t => t.category === 'family');

    const personalScore = personalTasks.length > 0
        ? Math.round((personalTasks.filter(t => t.completed).length / personalTasks.length) * 100)
        : 0;

    const familyScore = familyTasks.length > 0
        ? Math.round((familyTasks.filter(t => t.completed).length / familyTasks.length) * 100)
        : 0;

    // Insights Heuristics
    // 1. High Score
    let insight = null;
    if (score > 80) insight = "Your consistency is outstanding this week!";
    else if (score > 50) insight = "You're on track, keep pushing!";
    else if (score > 0) insight = "Focus on one small win today.";

    // 2. Specific Domain Insight
    if (personalScore > familyScore + 20) insight = "Personal tasks are strong; don't forget family commitments.";
    if (familyScore > personalScore + 20) insight = "Great family focus! Take time for yourself too.";

    return {
        score,
        trend: score > 50 ? 'improving' : 'stable', // simplistic placeholder
        completedCount: completed,
        totalCount: total,
        domainBreakdown: {
            personal: personalScore,
            family: familyScore
        },
        insight
    };
};
