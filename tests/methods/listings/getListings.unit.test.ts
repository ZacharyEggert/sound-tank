import { describe, expect, it, beforeEach } from 'vitest';
import { getMyListings, streamAllMyListings } from '../../../src/methods/listings/getListings';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { Listing, PaginatedReverbResponse } from '~/types';

describe('getListings (unit tests with MockHttpClient)', () => {
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

  describe('getMyListings', () => {
    it('should fetch listings with default options', async () => {
      const mockListings: Listing[] = [
        {
          id: '1',
          make: 'Fender',
          model: 'Stratocaster',
          finish: 'Sunburst',
          year: '2020',
          title: 'Fender Stratocaster',
          created_at: '2024-01-01',
          state: { slug: 'live' },
          _links: {},
        } as Listing,
      ];

      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: mockListings,
        total: 1,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('/my/listings'),
        createMockResponse(mockResponse)
      );

      const response = await getMyListings(mockClient, config, {});

      expect(response.status).toBe(200);
      expect(response.data.listings).toEqual(mockListings);
      expect(response.data.total).toBe(1);

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/listings');
    });

    it('should include page parameter in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 2,
        total_pages: 5,
        _links: {},
      };

      mockClient.onGet((url) => url.includes('page=2'), createMockResponse(mockResponse));

      await getMyListings(mockClient, config, { page: 2 });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('page=2');
    });

    it('should include perPage parameter in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('per_page=25'),
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, config, { perPage: 25 });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('per_page=25');
    });

    it('should include query parameter in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('query=guitar'),
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, config, { query: 'guitar' });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('query=guitar');
    });

    it('should include state parameter in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('state=live'),
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, config, { state: 'live' });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('state=live');
    });

    it('should include multiple parameters in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 2,
        total_pages: 5,
        _links: {},
      };

      mockClient.onGet(
        (url) =>
          url.includes('page=2') &&
          url.includes('per_page=50') &&
          url.includes('query=fender') &&
          url.includes('state=draft'),
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, config, {
        page: 2,
        perPage: 50,
        query: 'fender',
        state: 'draft',
      });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('page=2');
      expect(requests[0].url).toContain('per_page=50');
      expect(requests[0].url).toContain('query=fender');
      expect(requests[0].url).toContain('state=draft');
    });

    it('should send correct headers', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url, reqConfig) => {
          return (
            reqConfig?.headers?.Authorization === 'Bearer test-api-key' &&
            reqConfig?.headers?.['Accept-Version'] === '3.0'
          );
        },
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, config, {});

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe('Bearer test-api-key');
    });

    it('should use correct base URL from config', async () => {
      const customConfig = {
        ...config,
        rootEndpoint: 'https://custom.api.com' as any,
      };

      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.startsWith('https://custom.api.com'),
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, customConfig, {});

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('https://custom.api.com');
    });

    it('should handle empty listings array', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('/my/listings'),
        createMockResponse(mockResponse)
      );

      const response = await getMyListings(mockClient, config, {});

      expect(response.data.listings).toEqual([]);
      expect(response.data.total).toBe(0);
    });

    it('should handle pagination metadata', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 150,
        current_page: 3,
        total_pages: 6,
        _links: {
          next: { href: '/my/listings?page=4' },
          prev: { href: '/my/listings?page=2' },
        },
      };

      mockClient.onGet(
        (url) => url.includes('/my/listings'),
        createMockResponse(mockResponse)
      );

      const response = await getMyListings(mockClient, config, { page: 3 });

      expect(response.data.total).toBe(150);
      expect(response.data.current_page).toBe(3);
      expect(response.data.total_pages).toBe(6);
      expect(response.data._links.next).toBeDefined();
      expect(response.data._links.prev).toBeDefined();
    });

    it('should URL-encode query parameters correctly', async () => {
      const mockResponse: PaginatedReverbResponse<{ listings: Listing[] }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('query=hello%20world'),
        createMockResponse(mockResponse)
      );

      await getMyListings(mockClient, config, { query: 'hello world' });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('query=hello%20world');
    });
  });

  describe('streamAllMyListings', () => {
    function makePage(listings: Listing[], total: number, currentPage: number, totalPages: number): PaginatedReverbResponse<{ listings: Listing[] }> {
      return { listings, total, current_page: currentPage, total_pages: totalPages, _links: {} };
    }

    function makeListing(id: string): Listing {
      return { id, make: 'Fender', model: 'Strat', finish: '', year: '', title: '', created_at: '', shop_name: '', description: '', condition: { uuid: '', displayName: 'Good' }, price: {} as any, inventory: 0, has_inventory: false, offers_enabled: false, auction: false, categories: [], listing_currency: 'USD', published_at: '', buyer_price: {} as any, seller_price: {} as any, state: { slug: 'live', description: '' }, shipping_profile_id: 0, shipping: {} as any, stats: { views: 0, watches: 0 }, slug: id, photos: [], _links: {} as any };
    }

    it('should yield all listings across multiple pages', async () => {
      // perPage defaults to 50 — page 1 must have exactly 50 items for hasMore=true
      const page1Listings = Array.from({ length: 50 }, (_, i) => makeListing(`p1-${i}`));
      const page2Listings = [makeListing('last')];

      mockClient.onGet(
        (url) => url.includes('/my/listings'),
        (url) => {
          const page = url.includes('page=2') ? 2 : 1;
          const listings = page === 2 ? page2Listings : page1Listings;
          return createMockResponse(makePage(listings, 51, page, 2));
        },
      );

      const results: Listing[] = [];
      for await (const listing of streamAllMyListings(mockClient, config, {})) {
        results.push(listing);
      }

      expect(results).toHaveLength(51);
      expect(results[0].id).toBe('p1-0');
      expect(results[50].id).toBe('last');
    });

    it('should yield nothing when no listings exist', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/listings'),
        createMockResponse(makePage([], 0, 1, 0)),
      );

      const results: Listing[] = [];
      for await (const listing of streamAllMyListings(mockClient, config, {})) {
        results.push(listing);
      }

      expect(results).toHaveLength(0);
    });

    it('should pass query and state options through', async () => {
      mockClient.onGet(
        (url) => url.includes('query=gibson') && url.includes('state=live'),
        createMockResponse(makePage([makeListing('42')], 1, 1, 1)),
      );

      const results: Listing[] = [];
      for await (const listing of streamAllMyListings(mockClient, config, { query: 'gibson', state: 'live' as any })) {
        results.push(listing);
      }

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('42');
    });

    it('should emit listings as each page arrives, not all at once', async () => {
      const order: string[] = [];
      const page1 = Array.from({ length: 50 }, (_, i) => makeListing(`a${i}`));
      const page2 = [makeListing('z')];

      mockClient.onGet(
        (url) => url.includes('/my/listings'),
        (url) => {
          const page = url.includes('page=2') ? 2 : 1;
          const listings = page === 2 ? page2 : page1;
          return createMockResponse(makePage(listings, 51, page, 2));
        },
      );

      for await (const listing of streamAllMyListings(mockClient, config, {})) {
        order.push(listing.id as string);
      }

      expect(order).toHaveLength(51);
      expect(order[0]).toBe('a0');
      expect(order[50]).toBe('z');
      expect(mockClient.getRequests()).toHaveLength(2);
    });
  });
});
