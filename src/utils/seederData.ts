/**
 * Seeder Data Constants
 * Extracted from seeder.ts per CLAUDE.md §3.2
 */

export const TITLES = ['Groceries', 'Rent', 'Salary', 'Netflix', 'Coffee', 'Gym', 'Internet', 'Electricity', 'Dining Out', 'Freelance Project', 'Gas', 'Insurance', 'Phone Bill', 'School Fees', 'Books', 'Amazon', 'Apple', 'Spotify', 'Pharmacy', 'Vet'];
export const ACCOUNT_NAMES = ['Main Checking', 'Savings Goal', 'Emergency Fund', 'Travel Card', 'Investment Portfolio', 'Joint Account', 'House Fund'];
export const TASK_TITLES = ['Morning Jog', 'Read 30 mins', 'Weekly Review', 'Pay Bills', 'Call Mom', 'Gym Workout', 'Meal Prep', 'Clean House', 'Check Stocks', 'Plan Vacation', 'Bible Study', 'Code Review', 'Stretching'];
export const CATEGORIES = ['Living', 'Food', 'Entertainment', 'Health', 'Transport', 'Utilities', 'Personal', 'Income', 'Transfer'];
export const DOMAINS = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];
export const ACCOUNT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#6366f1'];

/** Cryptographically random float in [0, 1) — satisfies CodeQL js/insecure-randomness */
const secureRandom = (): number => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / (0xFFFFFFFF + 1);
};

export const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + secureRandom() * (end.getTime() - start.getTime()));
};

export const randomItem = <T>(arr: T[]): T => arr[Math.floor(secureRandom() * arr.length)];
