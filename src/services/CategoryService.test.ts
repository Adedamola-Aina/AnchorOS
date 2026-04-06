import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryService } from './CategoryService';

const { mockAddDocument, mockQueryCollection, mockDeleteDocument } = vi.hoisted(() => ({
  mockAddDocument: vi.fn().mockResolvedValue('cat-123'),
  mockQueryCollection: vi.fn().mockResolvedValue([]),
  mockDeleteDocument: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../utils/secureDb', () => ({
  secureDb: {
    addDocument: mockAddDocument,
    queryCollection: mockQueryCollection,
    deleteDocument: mockDeleteDocument,
  },
}));

describe('CategoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('returns default categories merged with custom ones', async () => {
      mockQueryCollection.mockResolvedValueOnce([
        { id: 'c1', name: 'Tithe', createdAt: '2025-01-01' },
      ]);
      const result = await CategoryService.getCategories('user-1');
      expect(result.length).toBeGreaterThan(14);
      expect(result).toContain('Tithe');
      expect(result).toContain('General');
    });

    it('returns only defaults when user has no custom categories', async () => {
      mockQueryCollection.mockResolvedValueOnce([]);
      const result = await CategoryService.getCategories('user-1');
      expect(result.length).toBe(14);
      expect(result).toContain('General');
    });

    it('deduplicates if custom category matches a default', async () => {
      mockQueryCollection.mockResolvedValueOnce([
        { id: 'c1', name: 'Groceries', createdAt: '2025-01-01' },
      ]);
      const result = await CategoryService.getCategories('user-1');
      const groceriesCount = result.filter((c: string) => c === 'Groceries').length;
      expect(groceriesCount).toBe(1);
    });
  });

  describe('addCategory', () => {
    it('creates a custom category via secureDb', async () => {
      const id = await CategoryService.addCategory('user-1', 'Tithe');
      expect(id).toBe('cat-123');
      expect(mockAddDocument).toHaveBeenCalledWith(
        'user-1',
        'categories',
        expect.objectContaining({ name: 'Tithe' }),
      );
    });

    it('rejects empty category names', async () => {
      await expect(CategoryService.addCategory('user-1', '')).rejects.toThrow();
    });

    it('rejects category names exceeding 50 characters', async () => {
      await expect(CategoryService.addCategory('user-1', 'A'.repeat(51))).rejects.toThrow();
    });
  });

  describe('deleteCategory', () => {
    it('deletes a custom category via secureDb', async () => {
      await CategoryService.deleteCategory('user-1', 'cat-123');
      expect(mockDeleteDocument).toHaveBeenCalledWith(
        'user-1',
        ['categories', 'cat-123'],
      );
    });
  });
});
