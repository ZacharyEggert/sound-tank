import Logger from './logger';

export interface PaginationOptions {
  perPage?: number;
  startPage?: number;
  maxPages?: number;
  throttle?: { delayMs: number; everyNPages: number };
}

export interface PaginatedFetchResult<T> {
  items: T[];
  hasMore: boolean;
  currentPage: number;
}

export async function paginateAll<T>(
  fetchPage: (
    page: number,
    perPage: number,
  ) => Promise<PaginatedFetchResult<T>>,
  options: PaginationOptions = {},
): Promise<T[]> {
  const {
    perPage = 50,
    startPage = 1,
    maxPages = Number.MAX_SAFE_INTEGER,
    throttle,
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

    if (result.items.length < perPage) {
      Logger.debug(
        'Received fewer items than perPage (%d < %d), assuming last page reached.',
        result.items.length,
        perPage,
      );
      break;
    }

    currentPage++;
    pagesProcessed++;

    if (throttle && pagesProcessed % throttle.everyNPages === 0) {
      Logger.debug(
        'Throttling: waiting %dms after %d pages.',
        throttle.delayMs,
        pagesProcessed,
      );
      await new Promise((resolve) => setTimeout(resolve, throttle.delayMs));
    }
  }

  Logger.debug(
    'Pagination complete. Total items fetched: %d across %d pages.',
    allItems.length,
    pagesProcessed,
  );
  return allItems;
}

export async function* paginateStream<T>(
  fetchPage: (
    page: number,
    perPage: number,
  ) => Promise<PaginatedFetchResult<T>>,
  options: PaginationOptions = {},
): AsyncGenerator<T[]> {
  const {
    perPage = 50,
    startPage = 1,
    maxPages = Number.MAX_SAFE_INTEGER,
    throttle,
  } = options;

  let currentPage = startPage;
  let pagesProcessed = 0;

  while (pagesProcessed < maxPages) {
    const result = await fetchPage(currentPage, perPage);

    if (result.items.length > 0) {
      yield result.items;
    }

    if (!result.hasMore || result.items.length === 0) {
      break;
    }

    if (result.items.length < perPage) {
      Logger.debug(
        'Received fewer items than perPage (%d < %d), assuming last page reached.',
        result.items.length,
        perPage,
      );
      break;
    }

    currentPage++;
    pagesProcessed++;

    if (throttle && pagesProcessed % throttle.everyNPages === 0) {
      Logger.debug(
        'Throttling: waiting %dms after %d pages.',
        throttle.delayMs,
        pagesProcessed,
      );
      await new Promise((resolve) => setTimeout(resolve, throttle.delayMs));
    }
  }

  Logger.debug(
    'Stream pagination complete after %d pages.',
    pagesProcessed + 1,
  );
}

export function createPaginatedResult<T>(
  items: T[],
  perPage: number,
  currentPage: number,
): PaginatedFetchResult<T> {
  return {
    items,
    hasMore: items.length === perPage,
    currentPage,
  };
}
