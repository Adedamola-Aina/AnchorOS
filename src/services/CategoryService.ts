import { secureDb } from '../utils/secureDb';
import type { CustomCategory } from '../types/categoryTypes';

const DEFAULT_CATEGORIES = [
  'General', 'Food', 'Groceries', 'Transport', 'Housing',
  'Utilities', 'Health', 'Entertainment', 'Travel', 'Education',
  'Salary', 'Investments', 'Shopping', 'Personal Care',
];

const MAX_NAME_LENGTH = 50;

export const CategoryService = {
  async getCategories(userId: string): Promise<string[]> {
    const custom = await secureDb.queryCollection<CustomCategory>(userId, 'categories');
    const customNames = custom.map((c) => c.name);
    const merged = new Set([...DEFAULT_CATEGORIES, ...customNames]);
    return [...merged];
  },

  async getCustomCategories(userId: string): Promise<CustomCategory[]> {
    return secureDb.queryCollection<CustomCategory>(userId, 'categories');
  },

  async addCategory(userId: string, name: string): Promise<string> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Category name cannot be empty');
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new Error(`Category name must be ${MAX_NAME_LENGTH} characters or less`);
    }
    return secureDb.addDocument(userId, 'categories', {
      name: trimmed,
      createdAt: new Date().toISOString(),
    });
  },

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    await secureDb.deleteDocument(userId, ['categories', categoryId]);
  },

  getDefaultCategories(): string[] {
    return [...DEFAULT_CATEGORIES];
  },
};
