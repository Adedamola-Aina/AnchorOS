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

/**
 * Unbiased cryptographic random integer in [0, max) via rejection sampling.
 * Satisfies both js/insecure-randomness and js/biased-cryptographic-random.
 */
export const secureRandomInt = (max: number): number => {
    if (max <= 0) return 0;
    const maxUint32PlusOne = 0x100000000;
    const maxSafeIntegerPlusOne = 0x20000000000000;

    if (max >= maxUint32PlusOne) {
        const buf = new Uint32Array(2);
        const limit = maxSafeIntegerPlusOne - (maxSafeIntegerPlusOne % max);
        let value: number;
        do {
            crypto.getRandomValues(buf);
            value = buf[0] * 0x200000 + (buf[1] >>> 11);
        } while (value >= limit);
        return value % max;
    }

    const buf = new Uint32Array(1);
    const limit = maxUint32PlusOne - (maxUint32PlusOne % max); // largest multiple of max in uint32 range
    let value: number;
    do {
        crypto.getRandomValues(buf);
        value = buf[0];
    } while (value >= limit);
    return value % max;
};

export const randomDate = (start: Date, end: Date): Date => {
    const range = end.getTime() - start.getTime();
    return new Date(start.getTime() + secureRandomInt(range));
};

export const randomItem = <T>(arr: T[]): T => arr[secureRandomInt(arr.length)];
