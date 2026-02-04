import { describe, expect, it, vi } from 'vitest';
import {
  paginateAll,
  createPaginatedResult,
  PaginatedFetchResult,
} from '../../src/utils/pagination';

describe('pagination', () => {
  describe('createPaginatedResult', () => {
    it('should create result with hasMore=true when items equal perPage', () => {
      const items = Array.from({ length: 50 }, (_, i) => i);
      const result = createPaginatedResult(items, 50, 1);

      expect(result).toEqual({
        items,
        hasMore: true,
        currentPage: 1,
      });
    });

    it('should create result with hasMore=false when items less than perPage', () => {
      const items = Array.from({ length: 25 }, (_, i) => i);
      const result = createPaginatedResult(items, 50, 2);

      expect(result).toEqual({
        items,
        hasMore: false,
        currentPage: 2,
      });
    });

    it('should create result with hasMore=false when items array is empty', () => {
      const items: number[] = [];
      const result = createPaginatedResult(items, 50, 1);

      expect(result).toEqual({
        items: [],
        hasMore: false,
        currentPage: 1,
      });
    });
  });

  describe('paginateAll', () => {
    it('should fetch all pages until no more items', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async (page, perPage) => {
        const pageData: Record<number, string[]> = {
          1: ['item1', 'item2', 'item3'],
          2: ['item4', 'item5', 'item6'],
          3: ['item7'], // Last page with fewer items
        };

        const items = pageData[page] || [];
        return {
          items,
          hasMore: items.length === perPage,
          currentPage: page,
        };
      });

      const result = await paginateAll(mockFetch, { perPage: 3 });

      expect(result).toEqual([
        'item1',
        'item2',
        'item3',
        'item4',
        'item5',
        'item6',
        'item7',
      ]);
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(1, 1, 3);
      expect(mockFetch).toHaveBeenNthCalledWith(2, 2, 3);
      expect(mockFetch).toHaveBeenNthCalledWith(3, 3, 3);
    });

    it('should stop when empty result is returned', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async (page) => {
        if (page === 1) {
          return {
            items: ['item1', 'item2'],
            hasMore: true,
            currentPage: 1,
          };
        }
        return {
          items: [],
          hasMore: false,
          currentPage: page,
        };
      });

      const result = await paginateAll(mockFetch, { perPage: 2 });

      expect(result).toEqual(['item1', 'item2']);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should stop when hasMore is false', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async (page) => {
        return {
          items: page === 1 ? ['item1'] : [],
          hasMore: false,
          currentPage: page,
        };
      });

      const result = await paginateAll(mockFetch, { perPage: 50 });

      expect(result).toEqual(['item1']);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should respect maxPages option', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async (page, perPage) => {
        return {
          items: Array.from({ length: perPage }, (_, i) => `item${page}-${i}`),
          hasMore: true,
          currentPage: page,
        };
      });

      const result = await paginateAll(mockFetch, { perPage: 2, maxPages: 3 });

      expect(result.length).toBe(6); // 3 pages * 2 items per page
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should use custom startPage', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async (page) => {
        return {
          items: page === 5 ? ['item5'] : [],
          hasMore: false,
          currentPage: page,
        };
      });

      const result = await paginateAll(mockFetch, { startPage: 5 });

      expect(result).toEqual(['item5']);
      expect(mockFetch).toHaveBeenCalledWith(5, 50); // Default perPage is 50
    });

    it('should handle single page of results', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async () => {
        return {
          items: ['only-item'],
          hasMore: false,
          currentPage: 1,
        };
      });

      const result = await paginateAll(mockFetch);

      expect(result).toEqual(['only-item']);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle empty first page', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async () => {
        return {
          items: [],
          hasMore: false,
          currentPage: 1,
        };
      });

      const result = await paginateAll(mockFetch);

      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should accumulate items from multiple pages', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<number>>
      >(async (page, perPage) => {
        const items =
          page <= 3
            ? Array.from({ length: perPage }, (_, i) => page * 100 + i)
            : [];

        return {
          items,
          hasMore: items.length === perPage,
          currentPage: page,
        };
      });

      const result = await paginateAll(mockFetch, { perPage: 10 });

      expect(result.length).toBe(30); // 3 pages * 10 items
      expect(result[0]).toBe(100); // First item from page 1
      expect(result[10]).toBe(200); // First item from page 2
      expect(result[20]).toBe(300); // First item from page 3
    });

    it('should stop when fewer items than perPage are returned', async () => {
      const mockFetch = vi.fn<
        [number, number],
        Promise<PaginatedFetchResult<string>>
      >(async (page) => {
        if (page === 1) {
          return {
            items: ['item1', 'item2', 'item3', 'item4', 'item5'],
            hasMore: true,
            currentPage: 1,
          };
        }
        return {
          items: ['item6'], // Only 1 item, less than perPage of 5
          hasMore: true, // Even though hasMore is true
          currentPage: 2,
        };
      });

      const result = await paginateAll(mockFetch, { perPage: 5 });

      expect(result).toEqual(['item1', 'item2', 'item3', 'item4', 'item5', 'item6']);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
