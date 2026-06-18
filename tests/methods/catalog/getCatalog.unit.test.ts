import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  getCategories,
  getConditions,
  getShippingRegions,
  getCurrencies,
} from '../../../src/methods/catalog/getCatalog';
import { CatalogResource } from '../../../src/resources/CatalogResource';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { ResponseCache } from '../../../src/utils/cache';
import {
  Category,
  ListingCondition,
  ReverbShippingRegion,
  ListingCurrency,
} from '~/types';

describe('getCatalog (unit tests with MockHttpClient)', () => {
  let mockClient: MockHttpClient;
  let config: ReverbConfig;

  beforeEach(() => {
    mockClient = new MockHttpClient();
    config = {
      rootEndpoint: 'https://api.reverb.com/api',
      apiKey: 'test-api-key',
      headers: {
        'Content-Type': 'application/hal+json',
        'Accept-Version': '3.0',
        Accept: 'application/hal+json',
        'Accept-Language': 'en',
        'X-Display-Currency': 'USD',
        Authorization: 'Bearer test-api-key',
      },
      version: '3.0',
      locale: 'en',
      displayCurrency: 'USD',
    };
  });

  describe('getCategories()', () => {
    it('should GET /categories/flat and return categories array', async () => {
      const categories: Category[] = [
        { uuid: 'cat-1', full_name: 'Electric Guitars' },
        { uuid: 'cat-2', full_name: 'Bass Guitars' },
      ];
      mockClient.onGet(
        (url) => url.includes('/categories/flat'),
        createMockResponse({ categories }),
      );

      const response = await getCategories(mockClient, config);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(categories);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/categories/flat');
      expect(requests[0].method).toBe('GET');
    });

    it('should return empty array when response has no categories', async () => {
      mockClient.onGet(
        (url) => url.includes('/categories/flat'),
        createMockResponse({} as any),
      );

      const response = await getCategories(mockClient, config);

      expect(response.data).toEqual([]);
    });
  });

  describe('getConditions()', () => {
    it('should GET /listing_conditions and return conditions array', async () => {
      const conditions: ListingCondition[] = [
        { uuid: 'cond-1', display_name: 'Excellent' },
        { uuid: 'cond-2', display_name: 'Good' },
      ];
      mockClient.onGet(
        (url) => url.includes('/listing_conditions'),
        createMockResponse({ conditions }),
      );

      const response = await getConditions(mockClient, config);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(conditions);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/listing_conditions');
      expect(requests[0].method).toBe('GET');
    });

    it('should return empty array when response has no conditions', async () => {
      mockClient.onGet(
        (url) => url.includes('/listing_conditions'),
        createMockResponse({} as any),
      );

      const response = await getConditions(mockClient, config);

      expect(response.data).toEqual([]);
    });
  });

  describe('getShippingRegions()', () => {
    it('should GET /shipping/regions and return shipping_regions array', async () => {
      const shipping_regions: ReverbShippingRegion[] = [
        { name: 'Continental US', code: 'US_CON' },
        { name: 'Everywhere Else', code: 'XX' },
      ];
      mockClient.onGet(
        (url) => url.includes('/shipping/regions'),
        createMockResponse({ shipping_regions }),
      );

      const response = await getShippingRegions(mockClient, config);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(shipping_regions);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/shipping/regions');
      expect(requests[0].method).toBe('GET');
    });

    it('should return empty array when response has no shipping_regions', async () => {
      mockClient.onGet(
        (url) => url.includes('/shipping/regions'),
        createMockResponse({} as any),
      );

      const response = await getShippingRegions(mockClient, config);

      expect(response.data).toEqual([]);
    });
  });

  describe('getCurrencies()', () => {
    it('should GET /currencies/listing and return currencies array', async () => {
      const currencies: ListingCurrency[] = ['USD', 'EUR'];
      mockClient.onGet(
        (url) => url.includes('/currencies/listing'),
        createMockResponse({ currencies }),
      );

      const response = await getCurrencies(mockClient, config);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(currencies);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/currencies/listing');
      expect(requests[0].method).toBe('GET');
    });

    it('should return empty array when response has no currencies', async () => {
      mockClient.onGet(
        (url) => url.includes('/currencies/listing'),
        createMockResponse({} as any),
      );

      const response = await getCurrencies(mockClient, config);

      expect(response.data).toEqual([]);
    });
  });

  describe('CatalogResource delegation', () => {
    it('getCategories() should delegate to underlying function', async () => {
      const categories: Category[] = [{ uuid: 'cat-1', full_name: 'Guitars' }];
      mockClient.onGet(
        (url) => url.includes('/categories/flat'),
        createMockResponse({ categories }),
      );

      const resource = new CatalogResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.getCategories();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(categories);
    });

    it('getConditions() should delegate to underlying function', async () => {
      const conditions: ListingCondition[] = [
        { uuid: 'c-1', display_name: 'New' },
      ];
      mockClient.onGet(
        (url) => url.includes('/listing_conditions'),
        createMockResponse({ conditions }),
      );

      const resource = new CatalogResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.getConditions();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(conditions);
    });

    it('getShippingRegions() should delegate to underlying function', async () => {
      const shipping_regions: ReverbShippingRegion[] = [
        { name: 'Continental US', code: 'US_CON' },
      ];
      mockClient.onGet(
        (url) => url.includes('/shipping/regions'),
        createMockResponse({ shipping_regions }),
      );

      const resource = new CatalogResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.getShippingRegions();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(shipping_regions);
    });

    it('getCurrencies() should delegate to underlying function', async () => {
      const currencies: ListingCurrency[] = ['USD'];
      mockClient.onGet(
        (url) => url.includes('/currencies/listing'),
        createMockResponse({ currencies }),
      );

      const resource = new CatalogResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.getCurrencies();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(currencies);
    });
  });

  describe('ResponseCache', () => {
    it('should return cached response on second call with same URL', async () => {
      const categories: Category[] = [{ uuid: 'cat-1', full_name: 'Guitars' }];
      mockClient.onGet(
        (url) => url.includes('/categories/flat'),
        createMockResponse({ categories }),
      );

      const cache = new ResponseCache(60_000);
      const cachedClient = cache.wrapClient(mockClient);

      await cachedClient.get('https://api.reverb.com/api/categories/flat', {});
      await cachedClient.get('https://api.reverb.com/api/categories/flat', {});

      expect(mockClient.getRequests()).toHaveLength(1);
    });

    it('should fetch fresh response after TTL expires', async () => {
      vi.useFakeTimers();

      const categories: Category[] = [{ uuid: 'cat-1', full_name: 'Guitars' }];
      mockClient.onGet(
        () => true,
        createMockResponse({ categories }),
      );

      const cache = new ResponseCache(1000);
      const cachedClient = cache.wrapClient(mockClient);

      await cachedClient.get('https://api.reverb.com/api/categories/flat', {});
      vi.advanceTimersByTime(1001);
      await cachedClient.get('https://api.reverb.com/api/categories/flat', {});

      expect(mockClient.getRequests()).toHaveLength(2);

      vi.useRealTimers();
    });

    it('should not cache non-GET requests', async () => {
      mockClient.onPut(
        () => true,
        createMockResponse({ id: '1' }),
      );

      const cache = new ResponseCache(60_000);
      const cachedClient = cache.wrapClient(mockClient);

      await cachedClient.put('https://api.reverb.com/api/listings/1', '{}', {});
      await cachedClient.put('https://api.reverb.com/api/listings/1', '{}', {});

      expect(mockClient.getRequests()).toHaveLength(2);
    });

    it('should isolate cache per ResponseCache instance', async () => {
      const categories: Category[] = [{ uuid: 'cat-1', full_name: 'Guitars' }];
      mockClient.onGet(
        () => true,
        createMockResponse({ categories }),
      );

      const cache1 = new ResponseCache(60_000);
      const cache2 = new ResponseCache(60_000);
      const client1 = cache1.wrapClient(mockClient);
      const client2 = cache2.wrapClient(mockClient);

      await client1.get('https://api.reverb.com/api/categories/flat', {});
      await client2.get('https://api.reverb.com/api/categories/flat', {});

      expect(mockClient.getRequests()).toHaveLength(2);
    });
  });
});
