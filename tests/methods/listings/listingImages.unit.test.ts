import { describe, expect, it, beforeEach } from 'vitest';
import {
  getListingImages,
  deleteListingPhoto,
  reorderListingPhotos,
} from '../../../src/methods/listings/listingImages';
import { ListingsResource } from '../../../src/resources/ListingsResource';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import { ListingImage, Listing, ListingStates } from '~/types';

describe('listingImages (unit tests with MockHttpClient)', () => {
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
      condition: { uuid: 'abc', display_name: 'Good' },
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

  describe('getListingImages()', () => {
    it('should GET /api/listings/:id/images and return images array', async () => {
      const images: ListingImage[] = [
        { id: 'img-1', url: 'https://example.com/img1.jpg' },
        { id: 'img-2', url: 'https://example.com/img2.jpg' },
      ];
      mockClient.onGet(
        (url) => url.includes('/listings/123/images'),
        createMockResponse({ images }),
      );

      const response = await getListingImages(mockClient, config, '123');

      expect(response.status).toBe(200);
      expect(response.data).toEqual(images);
      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/listings/123/images');
      expect(requests[0].method).toBe('GET');
    });

    it('should return empty array when no images field in response', async () => {
      mockClient.onGet(
        (url) => url.includes('/listings/456/images'),
        createMockResponse({} as any),
      );

      const response = await getListingImages(mockClient, config, '456');

      expect(response.data).toEqual([]);
    });

    it('should propagate errors', async () => {
      mockClient.onGet(
        (url) => url.includes('/listings/999/images'),
        () => {
          throw new Error('404 Not Found');
        },
      );

      await expect(getListingImages(mockClient, config, '999')).rejects.toThrow(
        '404 Not Found',
      );
    });
  });

  describe('deleteListingPhoto()', () => {
    it('should send DELETE to /api/listings/:id/images/:imageId', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/123/images/img-1'),
        createMockResponse(undefined, 204),
      );

      const response = await deleteListingPhoto(
        mockClient,
        config,
        '123',
        'img-1',
      );

      expect(response.status).toBe(204);
      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/listings/123/images/img-1');
      expect(requests[0].method).toBe('DELETE');
    });

    it('should propagate errors', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/999/images/bad-id'),
        () => {
          throw new Error('404 Not Found');
        },
      );

      await expect(
        deleteListingPhoto(mockClient, config, '999', 'bad-id'),
      ).rejects.toThrow('404 Not Found');
    });
  });

  describe('reorderListingPhotos()', () => {
    it('should send PUT to /api/listings/:id with photo_upload_method=override_position', async () => {
      const listing = makeListing({ id: '123' });
      mockClient.onPut(
        (url) => url.endsWith('/listings/123'),
        createMockResponse(listing),
      );

      const photoUrls = [
        'https://example.com/img2.jpg',
        'https://example.com/img1.jpg',
      ];
      const response = await reorderListingPhotos(
        mockClient,
        config,
        '123',
        photoUrls,
      );

      expect(response.status).toBe(200);
      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/listings/123');
      expect(requests[0].method).toBe('PUT');
      const body = JSON.parse(requests[0].data);
      expect(body.photos).toEqual(photoUrls);
      expect(body.photo_upload_method).toBe('override_position');
    });

    it('should propagate errors', async () => {
      mockClient.onPut(
        (url) => url.endsWith('/listings/999'),
        () => {
          throw new Error('422 Unprocessable Entity');
        },
      );

      await expect(
        reorderListingPhotos(mockClient, config, '999', []),
      ).rejects.toThrow('422 Unprocessable Entity');
    });
  });

  describe('ListingsResource.getImages(), deletePhoto(), reorderPhotos()', () => {
    it('getImages() should delegate to getListingImages', async () => {
      const images: ListingImage[] = [
        { id: 'img-1', url: 'https://example.com/img1.jpg' },
      ];
      mockClient.onGet(
        (url) => url.includes('/listings/123/images'),
        createMockResponse({ images }),
      );

      const resource = new ListingsResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.getImages('123');

      expect(response.status).toBe(200);
      expect(response.data).toEqual(images);
    });

    it('deletePhoto() should delegate to deleteListingPhoto', async () => {
      mockClient.onDelete(
        (url) => url.includes('/listings/123/images/img-1'),
        createMockResponse(undefined, 204),
      );

      const resource = new ListingsResource(
        () => mockClient,
        () => config,
      );
      const response = await resource.deletePhoto('123', 'img-1');

      expect(response.status).toBe(204);
      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('/listings/123/images/img-1');
      expect(requests[0].method).toBe('DELETE');
    });

    it('reorderPhotos() should delegate to reorderListingPhotos', async () => {
      const listing = makeListing({ id: '123' });
      mockClient.onPut(
        (url) => url.endsWith('/listings/123'),
        createMockResponse(listing),
      );

      const resource = new ListingsResource(
        () => mockClient,
        () => config,
      );
      const photoUrls = ['https://example.com/b.jpg', 'https://example.com/a.jpg'];
      const response = await resource.reorderPhotos('123', photoUrls);

      expect(response.status).toBe(200);
      const requests = mockClient.getRequests();
      const body = JSON.parse(requests[0].data);
      expect(body.photo_upload_method).toBe('override_position');
      expect(body.photos).toEqual(photoUrls);
    });
  });
});
