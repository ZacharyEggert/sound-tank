import { describe, expect, it, beforeEach } from 'vitest';
import {
  getNegotiations,
  getNegotiation,
} from '../../../src/methods/negotiations/getNegotiations';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  Negotiation,
  ListingWithNegotiations,
  PaginatedReverbResponse,
	ListingStates,
} from '~/types';

describe('getNegotiations (unit tests with MockHttpClient)', () => {
  let mockClient: MockHttpClient;
  let config: ReverbConfig;

  const mockNegotiation: Negotiation = {
    id: '53447768',
    state: 'active',
    offers_count: 1,
    expires_at: '2026-03-26T16:15:12-05:00',
    created_at: '2026-03-24T16:15:12-05:00',
    updated_at: '2026-03-24T16:15:12-05:00',
    buyer_name: 'Oguzhan Ozkan',
    buyer_id: '14681884',
    shop_id: '515464',
    seller_name: 'Diablo Guitars',
    other_party_name: 'Oguzhan Ozkan',
    other_party: {
      _links: {
        avatar: {
          href: 'https://static.reverb-assets.com/assets/avatars/default.jpg',
        },
      },
      profile_slug: null,
    },
    shop_name: 'DIABLO GUITARS - AXES OF EVIL!',
    actionable: false,
    can_ship_to_buyer: true,
    buyer_shipping_region_code: 'US_CON',
    buyer_address: {
      region: 'FL',
      locality: 'Orlando',
      country_code: 'US',
      display_location: 'Orlando, FL, United States',
      id: '134885205',
      primary: true,
      name: 'Oguzhan Ozkan',
      street_address: '1969 South Kirkman Road',
      extended_address: 'Apt 40',
      postal_code: '32811',
      phone: '2079392287',
      unformatted_phone: '2079392287',
      complete_shipping_address: true,
      _links: {
        self: { href: 'https://api.reverb.com/api/my/addresses/134885205' },
      },
    },
    last_offered_price: {
      original: {
        amount: '2374.99',
        amount_cents: 237499,
        currency: 'USD',
        symbol: '$',
        display: '$2,374.99',
      },
      display: {
        amount: '2374.99',
        amount_cents: 237499,
        currency: 'USD',
        symbol: '$',
        display: '$2,374.99',
      },
    },
    last_offered_shipping: {
      original: {
        amount: '80.00',
        amount_cents: 8000,
        currency: 'USD',
        symbol: '$',
        display: '$80',
      },
      display: {
        amount: '80.00',
        amount_cents: 8000,
        currency: 'USD',
        symbol: '$',
        display: '$80',
      },
    },
    last_offered_total: {
      original: {
        amount: '2454.99',
        amount_cents: 245499,
        currency: 'USD',
        symbol: '$',
        display: '$2,454.99',
      },
      display: {
        amount: '2454.99',
        amount_cents: 245499,
        currency: 'USD',
        symbol: '$',
        display: '$2,454.99',
      },
    },
    offers: [
      {
        created_at: '2026-03-24T16:15:12-05:00',
        message:
          "You've received this special offer because you're watching this item!",
        price: {
          original: {
            amount: '2374.99',
            amount_cents: 237499,
            currency: 'USD',
            symbol: '$',
            display: '$2,374.99',
          },
          display: {
            amount: '2374.99',
            amount_cents: 237499,
            currency: 'USD',
            symbol: '$',
            display: '$2,374.99',
          },
        },
        shipping_price: {
          original: {
            amount: '80.00',
            amount_cents: 8000,
            currency: 'USD',
            symbol: '$',
            display: '$80',
          },
          display: {
            amount: '80.00',
            amount_cents: 8000,
            currency: 'USD',
            symbol: '$',
            display: '$80',
          },
        },
        total_price: {
          original: {
            amount: '2454.99',
            amount_cents: 245499,
            currency: 'USD',
            symbol: '$',
            display: '$2,454.99',
          },
          display: {
            amount: '2454.99',
            amount_cents: 245499,
            currency: 'USD',
            symbol: '$',
            display: '$2,454.99',
          },
        },
        initiated_by_name: 'Diablo Guitars',
        initiated_by_shop_name: 'DIABLO GUITARS - AXES OF EVIL!',
        initiated_by_me: true,
        initiator_type: 'seller',
      },
    ],
    _links: {
      listing: { href: 'https://api.reverb.com/api/listings/94128653' },
      self: { href: 'https://api.reverb.com/api/my/negotiations/53447768' },
      counter: {
        href: 'https://api.reverb.com/api/my/negotiations/53447768/counter',
        method: 'POST',
      },
      accept: {
        href: 'https://api.reverb.com/api/my/negotiations/53447768/accept',
        method: 'POST',
      },
      decline: {
        href: 'https://api.reverb.com/api/my/negotiations/53447768/decline',
        method: 'POST',
      },
    },
  };

  const mockListing: ListingWithNegotiations = {
    id: 94128653,
    make: 'ESP',
    model: 'Eclipse-II SW',
    finish: 'Snow White',
    year: '2010',
    title: 'ESP Eclipse-II SW Snow White 2010 w/Hard Shell Case',
    created_at: '2026-01-19T17:29:55-06:00',
    shop_name: 'DIABLO GUITARS - AXES OF EVIL!',
    description: 'ESP Eclipse-II SW in Snow White finish.',
    condition: {
      uuid: 'ae4d9114-1bd7-4ec5-a4ba-6653af5ac84d',
      displayName: 'Very Good',
    },
    price: {
      amount: '2499.99',
      amount_cents: 249999,
      currency: 'USD',
      symbol: '$',
      display: '$2,499.99',
    },
    inventory: 1,
    has_inventory: false,
    offers_enabled: true,
    auction: false,
    categories: [
      {
        uuid: 'e57deb7a-382b-4e18-a008-67d4fbcb2879',
        full_name: 'Electric Guitars / Solid Body',
      },
    ],
    listing_currency: 'USD',
    published_at: '2026-01-19T19:43:35-06:00',
    buyer_price: {
      amount: '2499.99',
      amount_cents: 249999,
      currency: 'USD',
      symbol: '$',
      display: '$2,499.99',
    },
    seller_price: {
      amount: '2499.99',
      amount_cents: 249999,
      currency: 'USD',
      symbol: '$',
      display: '$2,499.99',
    },
    state: { slug: ListingStates.LIVE, description: 'Live' },
    shipping_profile_id: 61256,
    shipping: {
      local: false,
      rates: [],
      user_region_rate: null as any,
      initial_offer_rate: null as any,
    },
    stats: { views: 0, watches: 0 },
    slug: '94128653-esp-eclipse-ii-sw-snow-white-2010-w-hard-shell-case',
    photos: [],
    _links: {} as any,
    negotiations: [mockNegotiation],
  };

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

  describe('getNegotiations', () => {
    it('should fetch listings with nested negotiations', async () => {
      const mockResponse: PaginatedReverbResponse<{
        listings: ListingWithNegotiations[];
      }> = {
        listings: [mockListing],
        total: 1,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('/my/listings/negotiations'),
        createMockResponse(mockResponse),
      );

      const response = await getNegotiations(mockClient, config, {});

      expect(response.status).toBe(200);
      expect(response.data.listings).toHaveLength(1);

      const listing = response.data.listings[0];
      expect(listing.id).toBe(94128653);
      expect(listing.negotiations).toHaveLength(1);

      const negotiation = listing.negotiations[0];
      expect(negotiation.id).toBe('53447768');
      expect(negotiation.state).toBe('active');
      expect(negotiation.buyer_name).toBe('Oguzhan Ozkan');
      expect(negotiation.last_offered_price.display.amount).toBe('2374.99');
      expect(negotiation.last_offered_total.display.amount_cents).toBe(245499);

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/listings/negotiations');
    });

    it('should include page and perPage params in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{
        listings: ListingWithNegotiations[];
      }> = {
        listings: [],
        total: 0,
        current_page: 2,
        total_pages: 5,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('page=2') && url.includes('per_page=10'),
        createMockResponse(mockResponse),
      );

      await getNegotiations(mockClient, config, { page: 2, perPage: 10 });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('page=2');
      expect(requests[0].url).toContain('per_page=10');
    });

    it('should include status param in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{
        listings: ListingWithNegotiations[];
      }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('status=active'),
        createMockResponse(mockResponse),
      );

      await getNegotiations(mockClient, config, { status: 'active' });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('status=active');
    });

    it('should include negotiation_type param in URL', async () => {
      const mockResponse: PaginatedReverbResponse<{
        listings: ListingWithNegotiations[];
      }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('negotiation_type=auto_push_offer'),
        createMockResponse(mockResponse),
      );

      await getNegotiations(mockClient, config, {
        negotiation_type: 'auto_push_offer',
      });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('negotiation_type=auto_push_offer');
    });

    it('should omit undefined params from URL', async () => {
      const mockResponse: PaginatedReverbResponse<{
        listings: ListingWithNegotiations[];
      }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (url) => url.includes('/my/listings/negotiations'),
        createMockResponse(mockResponse),
      );

      await getNegotiations(mockClient, config, {});

      const requests = mockClient.getRequests();
      expect(requests[0].url).not.toContain('page=');
      expect(requests[0].url).not.toContain('per_page=');
      expect(requests[0].url).not.toContain('status=');
      expect(requests[0].url).not.toContain('negotiation_type=');
    });

    it('should send correct headers', async () => {
      const mockResponse: PaginatedReverbResponse<{
        listings: ListingWithNegotiations[];
      }> = {
        listings: [],
        total: 0,
        current_page: 1,
        total_pages: 1,
        _links: {},
      };

      mockClient.onGet(
        (_url, reqConfig) =>
          reqConfig?.headers?.Authorization === 'Bearer test-api-key' &&
          reqConfig?.headers?.['Accept-Version'] === '3.0',
        createMockResponse(mockResponse),
      );

      await getNegotiations(mockClient, config, {});

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });
  });

  describe('getNegotiation', () => {
    it('should fetch a single negotiation by id', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/negotiations/53447768'),
        createMockResponse(mockNegotiation),
      );

      const response = await getNegotiation(mockClient, config, 53447768);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe('53447768');
      expect(response.data.state).toBe('active');
      expect(response.data.buyer_name).toBe('Oguzhan Ozkan');
      expect(response.data.offers_count).toBe(1);
      expect(response.data.offers).toHaveLength(1);
      expect(response.data.offers![0].initiator_type).toBe('seller');
      expect(response.data.offers![0].initiated_by_me).toBe(true);
      expect(response.data._links.counter.method).toBe('POST');

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/negotiations/53447768');
    });

    it('should use the offerId in the URL', async () => {
      const otherId = 99;

      mockClient.onGet(
        (url) => url.includes(`/my/negotiations/${otherId}`),
        createMockResponse({ ...mockNegotiation, id: String(otherId) }),
      );

      await getNegotiation(mockClient, config, otherId);

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain(`/my/negotiations/${otherId}`);
    });

    it('should send correct headers', async () => {
      mockClient.onGet(
        (_url, reqConfig) =>
          reqConfig?.headers?.Authorization === 'Bearer test-api-key' &&
          reqConfig?.headers?.['Accept-Version'] === '3.0',
        createMockResponse(mockNegotiation),
      );

      await getNegotiation(mockClient, config, 53447768);

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });
  });
});
