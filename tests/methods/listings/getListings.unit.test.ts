import { describe, expect, it, beforeEach } from 'vitest';
import { getMyListingsWithClient } from '../../../src/methods/listings/getListings';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { Listing } from '~/types';
import { PaginatedReverbResponse } from '../../../src/methods';

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

  describe('getMyListingsWithClient', () => {
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

      const response = await getMyListingsWithClient(mockClient, config, {});

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

      await getMyListingsWithClient(mockClient, config, { page: 2 });

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

      await getMyListingsWithClient(mockClient, config, { perPage: 25 });

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

      await getMyListingsWithClient(mockClient, config, { query: 'guitar' });

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

      await getMyListingsWithClient(mockClient, config, { state: 'live' });

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

      await getMyListingsWithClient(mockClient, config, {
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

      await getMyListingsWithClient(mockClient, config, {});

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

      await getMyListingsWithClient(mockClient, customConfig, {});

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

      const response = await getMyListingsWithClient(mockClient, config, {});

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

      const response = await getMyListingsWithClient(mockClient, config, { page: 3 });

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

      await getMyListingsWithClient(mockClient, config, { query: 'hello world' });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('query=hello%20world');
    });
  });
});
