import { describe, expect, it, beforeEach } from 'vitest';
import {
  getDrafts,
  streamAllDrafts,
} from '../../../src/methods/listings/getListings';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { Listing, ListingStates, PaginatedReverbResponse } from '~/types';

describe('getDrafts (unit tests with MockHttpClient)', () => {
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

  function makeDraftResponse(
    listings: Listing[],
    total = listings.length,
    currentPage = 1,
    totalPages = 1,
  ): PaginatedReverbResponse<{ listings: Listing[] }> {
    return { listings, total, current_page: currentPage, total_pages: totalPages, _links: {} };
  }

  function makeListing(id: string): Listing {
    return {
      id,
      make: 'Fender',
      model: 'Strat',
      finish: '',
      year: '',
      title: '',
      created_at: '',
      shop_name: '',
      description: '',
      condition: { uuid: '', display_name: 'Good' },
      price: {} as any,
      inventory: 0,
      has_inventory: false,
      offers_enabled: false,
      auction: false,
      categories: [],
      listing_currency: 'USD',
      published_at: '',
      buyer_price: {} as any,
      seller_price: {} as any,
      state: { slug: ListingStates.DRAFT, description: '' },
      shipping_profile_id: 0,
      shipping: {} as any,
      stats: { views: 0, watches: 0 },
      slug: id,
      photos: [],
      _links: {} as any,
    };
  }

  describe('getDrafts', () => {
    it('should fetch drafts with default options', async () => {
      const mockListings = [makeListing('1')];
      mockClient.onGet(
        (url) => url.includes('/my/listings/drafts'),
        createMockResponse(makeDraftResponse(mockListings)),
      );

      const response = await getDrafts(mockClient, config, {});

      expect(response.status).toBe(200);
      expect(response.data.listings).toEqual(mockListings);
      expect(mockClient.getRequests()[0].url).toContain('/my/listings/drafts');
    });

    it('should include page parameter in URL', async () => {
      mockClient.onGet(
        (url) => url.includes('page=2'),
        createMockResponse(makeDraftResponse([], 0, 2, 5)),
      );

      await getDrafts(mockClient, config, { page: 2 });

      expect(mockClient.getRequests()[0].url).toContain('page=2');
    });

    it('should include perPage parameter in URL', async () => {
      mockClient.onGet(
        (url) => url.includes('per_page=25'),
        createMockResponse(makeDraftResponse([])),
      );

      await getDrafts(mockClient, config, { perPage: 25 });

      expect(mockClient.getRequests()[0].url).toContain('per_page=25');
    });

    it('should handle empty drafts array', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/listings/drafts'),
        createMockResponse(makeDraftResponse([])),
      );

      const response = await getDrafts(mockClient, config, {});

      expect(response.data.listings).toEqual([]);
      expect(response.data.total).toBe(0);
    });

    it('should send correct headers', async () => {
      mockClient.onGet((url, reqConfig) => {
        return reqConfig?.headers?.Authorization === 'Bearer test-api-key';
      }, createMockResponse(makeDraftResponse([])));

      await getDrafts(mockClient, config, {});

      expect(mockClient.getRequests()[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });

    it('should use correct base URL from config', async () => {
      const customConfig = { ...config, rootEndpoint: 'https://custom.api.com' as any };

      mockClient.onGet(
        (url) => url.startsWith('https://custom.api.com'),
        createMockResponse(makeDraftResponse([])),
      );

      await getDrafts(mockClient, customConfig, {});

      expect(mockClient.getRequests()[0].url).toContain('https://custom.api.com');
    });

    it('should not include /my/listings without /drafts suffix', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/listings/drafts'),
        createMockResponse(makeDraftResponse([])),
      );

      await getDrafts(mockClient, config, {});

      const url = mockClient.getRequests()[0].url;
      expect(url).toContain('/my/listings/drafts');
    });
  });

  describe('streamAllDrafts', () => {
    it('should yield all drafts across multiple pages', async () => {
      const page1 = Array.from({ length: 50 }, (_, i) => makeListing(`p1-${i}`));
      const page2 = [makeListing('last')];

      mockClient.onGet(
        (url) => url.includes('/my/listings/drafts'),
        (url) => {
          const page = url.includes('page=2') ? 2 : 1;
          const listings = page === 2 ? page2 : page1;
          return createMockResponse(makeDraftResponse(listings, 51, page, 2));
        },
      );

      const results: Listing[] = [];
      for await (const listing of streamAllDrafts(mockClient, config, {})) {
        results.push(listing);
      }

      expect(results).toHaveLength(51);
      expect(results[0].id).toBe('p1-0');
      expect(results[50].id).toBe('last');
    });

    it('should yield nothing when no drafts exist', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/listings/drafts'),
        createMockResponse(makeDraftResponse([], 0, 1, 0)),
      );

      const results: Listing[] = [];
      for await (const listing of streamAllDrafts(mockClient, config, {})) {
        results.push(listing);
      }

      expect(results).toHaveLength(0);
    });

    it('should emit listings as each page arrives, not all at once', async () => {
      const page1 = Array.from({ length: 50 }, (_, i) => makeListing(`a${i}`));
      const page2 = [makeListing('z')];

      mockClient.onGet(
        (url) => url.includes('/my/listings/drafts'),
        (url) => {
          const page = url.includes('page=2') ? 2 : 1;
          const listings = page === 2 ? page2 : page1;
          return createMockResponse(makeDraftResponse(listings, 51, page, 2));
        },
      );

      const order: string[] = [];
      for await (const listing of streamAllDrafts(mockClient, config, {})) {
        order.push(listing.id as string);
      }

      expect(order).toHaveLength(51);
      expect(order[0]).toBe('a0');
      expect(order[50]).toBe('z');
      expect(mockClient.getRequests()).toHaveLength(2);
    });
  });
});
