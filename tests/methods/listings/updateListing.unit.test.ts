import { describe, expect, it, beforeEach } from 'vitest';
import { updateListing } from '../../../src/methods/listings/updateListing';
import { ListingsResource } from '../../../src/resources/ListingsResource';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { Listing, ListingStates } from '~/types';

describe('updateListing (unit tests with MockHttpClient)', () => {
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
      price: {
        amount: '500.00',
        amount_cents: 50000,
        currency: 'USD',
        symbol: '$',
        display: '$500',
      },
      inventory: 1,
      has_inventory: true,
      offers_enabled: false,
      auction: false,
      categories: [],
      listing_currency: 'USD',
      published_at: '2024-01-01',
      buyer_price: {} as any,
      seller_price: {} as any,
      state: { slug: ListingStates.DRAFT, description: 'Draft' },
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

  it('should send PUT to /api/listings/:id and return the listing', async () => {
    const listing = makeListing({ id: '123' });
    mockClient.onPut(
      (url) => url.includes('/listings/123'),
      createMockResponse(listing),
    );

    const response = await updateListing(mockClient, config, '123', {
      description: 'Updated',
    });

    expect(response.status).toBe(200);
    expect(response.data.id).toBe('123');
    const requests = mockClient.getRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain('/listings/123');
    expect(requests[0].method).toBe('PUT');
  });

  it('should send publish flag in body when provided', async () => {
    const listing = makeListing({
      id: '456',
      state: { slug: ListingStates.LIVE, description: 'Live' },
    });
    mockClient.onPut(
      (url) => url.includes('/listings/456'),
      createMockResponse(listing),
    );

    const response = await updateListing(mockClient, config, '456', {
      publish: true,
    });

    expect(response.status).toBe(200);
    const requests = mockClient.getRequests();
    expect(requests[0].data).toContain('"publish":true');
  });

  it('should work with an empty body', async () => {
    const listing = makeListing({ id: '789' });
    mockClient.onPut(
      (url) => url.includes('/listings/789'),
      createMockResponse(listing),
    );

    const response = await updateListing(mockClient, config, '789', {});

    expect(response.status).toBe(200);
    const requests = mockClient.getRequests();
    expect(requests[0].url).toContain('/listings/789');
  });

  it('should propagate errors for unknown ids', async () => {
    mockClient.onPut(
      (url) => url.includes('/listings/999'),
      () => {
        throw new Error('404 Not Found');
      },
    );

    await expect(updateListing(mockClient, config, '999', {})).rejects.toThrow(
      '404 Not Found',
    );
  });

  describe('ListingsResource.publish()', () => {
    it('should call PUT with { publish: true } body', async () => {
      const listing = makeListing({
        id: '111',
        state: { slug: ListingStates.LIVE, description: 'Live' },
      });
      mockClient.onPut(
        (url) => url.includes('/listings/111'),
        createMockResponse(listing),
      );

      const resource = new ListingsResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.publish('111');

      expect(response.status).toBe(200);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/listings/111');
      expect(requests[0].data).toContain('"publish":true');
    });

    it('should be equivalent to update(id, { publish: true })', async () => {
      const listing = makeListing({ id: '222' });
      mockClient.onPut(
        (url) => url.includes('/listings/222'),
        createMockResponse(listing),
      );

      const resource = new ListingsResource(
        () => mockClient,
        () => config,
      );
      const viaPublish = await resource.publish('222');

      mockClient.clearRequests();
      mockClient.onPut(
        (url) => url.includes('/listings/222'),
        createMockResponse(listing),
      );
      const viaUpdate = await resource.update('222', { publish: true });

      expect(viaPublish.status).toBe(viaUpdate.status);
      // Both should have sent the same body
      const allRequests = mockClient.getRequests();
      expect(allRequests[0].data).toContain('"publish":true');
    });
  });
});
