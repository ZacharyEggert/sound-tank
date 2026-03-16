import Logger from "./logger";

export interface PaginationOptions {
  perPage?: number;
  startPage?: number;
  maxPages?: number;
}

export interface PaginatedFetchResult<T> {
  items: T[];
  hasMore: boolean;
  currentPage: number;
}

/**
 * Generic pagination helper that fetches all items across multiple pages.
 *
 * @param fetchPage - Function that fetches a single page of results
 * @param options - Pagination configuration options
 * @returns Promise resolving to all items across all pages
 *
 * @example
 * ```ts
 * const allListings = await paginateAll(
 *   async (page, perPage) => {
 *     const response = await getMyListings({ page, perPage });
 *     return {
 *       items: response.data.listings,
 *       hasMore: response.data.listings.length === perPage,
 *       currentPage: page
 *     };
 *   },
 *   { perPage: 50 }
 * );
 * ```
 */
export async function paginateAll<T>(
  fetchPage: (
    page: number,
    perPage: number
  ) => Promise<PaginatedFetchResult<T>>,
  options: PaginationOptions = {}
): Promise<T[]> {
  const {
    perPage = 50,
    startPage = 1,
    maxPages = Number.MAX_SAFE_INTEGER,
  } = options;

  const allItems: T[] = [];
  let currentPage = startPage;
  let pagesProcessed = 0;

  while (pagesProcessed < maxPages) {
    const result = await fetchPage(currentPage, perPage);

    allItems.push(...result.items);

    if (!result.hasMore || result.items.length === 0) {
      break;
    }

    // Stop if we got fewer items than requested (indicates last page)
    if (result.items.length < perPage) {
			Logger.debug('Received fewer items than perPage (%d < %d), assuming last page reached.', result.items.length, perPage);
      break;
    }

    currentPage++;
    pagesProcessed++;
  }

	Logger.debug('Pagination complete. Total items fetched: %d across %d pages.', allItems.length, pagesProcessed);
  return allItems;
}

/**
 * Helper to create a PaginatedFetchResult from common API response patterns.
 * Useful when your API returns the count of items in a response.
 *
 * @param items - Array of items from the current page
 * @param perPage - Number of items requested per page
 * @param currentPage - Current page number
 * @returns PaginatedFetchResult
 *
 * @example
 * ```ts
 * return createPaginatedResult(response.data.listings, 50, page);
 * ```
 */
export function createPaginatedResult<T>(
  items: T[],
  perPage: number,
  currentPage: number
): PaginatedFetchResult<T> {
  return {
    items,
    hasMore: items.length === perPage,
    currentPage,
  };
}
