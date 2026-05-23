import { describe, expect, it, beforeEach } from 'vitest';
import { endListing, deleteListing } from '../../../src/methods/listings/endListing';
import { ListingsResource } from '../../../src/resources/ListingsResource';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { Listing, ListingStates } from '~/types';

describe('endListing / deleteListing (unit tests with MockHttpClient)', () => {
  let mockClient: MockHttpClient;
  let config: ReverbConfig;

  function makeListing(overrides: Partial<Listing> = {}): Listing {
    return {
      id: '123',
      make: 'Fender',
      model: 'Stratocaster',
      finish: 'Sunburst',
      year: '2020',
      title: 'Fender Stratocaster',
      created_at: '2024-01-01',
      shop_name: 'Test Shop',
      description: 'A great guitar',
      condition: { uuid: 'abc', displayName: 'Good' },
      price: { amount: '500.00', amount_cents: 50000, currency: 'USD', symbol: '$', display: '$500' },
      inventory: 1,
      has_inventory: true,
      offers_enabled: false,
      auction: false,
      categories: [],
      listing_currency: 'USD',
      published_at: '2024-01-01',
      buyer_price: {} as any,
      seller_price: {} as any,
      state: { slug: ListingStates.LIVE, description: 'Live' },
      shipping_profile_id: 0,
      shipping: {} as any,
      stats: { views: 0, watches: 0 },
      slug: 'fender-stratocaster',
      photos: [],
      _links: {} as any,
      ...overrides,
    };
  }

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

  describe('endListing()', () => {
    it('should send PUT to /api/my/listings/:id/state/end with reason=not_sold', async () => {
      const listing = makeListing({ id: '123', state: { slug: 'ended' as any, description: 'Ended' } });
      mockClient.onPut(
        (url) => url.includes('/my/listings/123/state/end'),
        createMockResponse(listing),
      );

      const response = await endListing(mockClient, config, '123', 'not_sold');

      expect(response.status).toBe(200);
      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/listings/123/state/end');
      expect(requests[0].method).toBe('PUT');
      expect(requests[0].data).toContain('"reason":"not_sold"');
    });

    it('should send PUT with reason=reverb_sale', async () => {
      const listing = makeListing({ id: '456', state: { slug: 'ended' as any, description: 'Ended' } });
      mockClient.onPut(
        (url) => url.includes('/my/listings/456/state/end'),
        createMockResponse(listing),
      );

      const response = await endListing(mockClient, config, '456', 'reverb_sale');

      expect(response.status).toBe(200);
      const requests = mockClient.getRequests();
      expect(requests[0].data).toContain('"reason":"reverb_sale"');
    });

    it('should propagate errors', async () => {
      mockClient.onPut(
        (url) => url.includes('/my/listings/999/state/end'),
        () => { throw new Error('404 Not Found'); },
      );

      await expect(
        endListing(mockClient, config, '999', 'not_sold'),
      ).rejects.toThrow('404 Not Found');
    });
  });

  describe('deleteListing()', () => {
    it('should send DELETE to /api/listings/:id', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/123'),
        createMockResponse(undefined, 204),
      );

      const response = await deleteListing(mockClient, config, '123');

      expect(response.status).toBe(204);
      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/listings/123');
      expect(requests[0].method).toBe('DELETE');
    });

    it('should return HttpResponse<void>', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/789'),
        createMockResponse(undefined, 204),
      );

      const response = await deleteListing(mockClient, config, '789');

      expect(response.status).toBe(204);
      expect(response.data).toBeUndefined();
    });

    it('should propagate error when deleting a live listing', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/live-id'),
        () => { throw new Error('422 Cannot delete a live listing'); },
      );

      await expect(
        deleteListing(mockClient, config, 'live-id'),
      ).rejects.toThrow('422 Cannot delete a live listing');
    });
  });

  describe('ListingsResource.end() and .delete()', () => {
    it('end() should delegate to endListing with correct args', async () => {
      const listing = makeListing({ id: '111' });
      mockClient.onPut(
        (url) => url.includes('/my/listings/111/state/end'),
        createMockResponse(listing),
      );

      const resource = new ListingsResource(() => mockClient, () => config);
      const response = await resource.end('111', 'not_sold');

      expect(response.status).toBe(200);
      const requests = mockClient.getRequests();
      expect(requests[0].data).toContain('"reason":"not_sold"');
    });

    it('delete() should delegate to deleteListing', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/222'),
        createMockResponse(undefined, 204),
      );

      const resource = new ListingsResource(() => mockClient, () => config);
      const response = await resource.delete('222');

      expect(response.status).toBe(204);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/listings/222');
      expect(requests[0].method).toBe('DELETE');
    });
  });
});
