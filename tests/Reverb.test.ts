import { expect, it, suite } from 'vitest';

import Reverb from '../src/Reverb';
import { config } from 'dotenv';

config();

const defaultHeaders = Reverb.defaultHeaders;

suite('Reverb', () => {
  it('should throw if no api key is given', () => {
    // @ts-ignore
    expect(() => new Reverb({})).toThrow('Reverb: apiKey is required');
  });

  it('should set the default endpoint', () => {
    const reverb = new Reverb({ apiKey: '123' });
    expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api');
  });

  it('should set the default version', () => {
    const reverb = new Reverb({ apiKey: '123' });
    expect(reverb.version).toBe('3.0');
  });

  it('should set the default headers', () => {
    const reverb = new Reverb({ apiKey: '123' });
    expect(reverb.headers).toEqual({
      ...defaultHeaders,
      Authorization: 'Bearer 123',
    });
  });

  it('should set the headers with the given options', () => {
    const reverb = new Reverb({
      apiKey: '123',
      version: '1.0',
      displayCurrency: 'CAD',
      shippingRegion: 'CA',
      locale: 'fr',
    });

    expect(reverb.headers).toEqual({
      ...defaultHeaders,
      'Accept-Version': '1.0',
      'Accept-Language': 'fr',
      'X-Display-Currency': 'CAD',
      'X-Shipping-Region': 'CA',
      Authorization: 'Bearer 123',
    });
  });

  it('should set the display currency and locale if provided', () => {
    const reverb = new Reverb({ apiKey: '123', displayCurrency: 'CAD', locale: 'fr' });
    const reverb2 = new Reverb({ apiKey: '123' });

    expect(reverb.displayCurrency).toBe('CAD');
    expect(reverb.locale).toBe('fr');
    expect(reverb.headers).toEqual({
      ...defaultHeaders,
      'Accept-Language': 'fr',
      'X-Display-Currency': 'CAD',
      Authorization: 'Bearer 123',
    });

    expect(reverb2.displayCurrency).toBe('USD');
    expect(reverb2.locale).toBe('en');
    expect(reverb2.headers).toEqual({
      ...defaultHeaders,
      Authorization: 'Bearer 123',
    });
  });

  it('should set the default endpoint if provided', () => {
    const reverb = new Reverb({ apiKey: '123', rootEndpoint: 'https://api.reverb.com/api2' });
    expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api2');
  });

  suite('Getters and Setters', () => {
    it('setters should update the headers when any option is updated', () => {
      const reverb = new Reverb({ apiKey: '123' });

      expect(reverb.headers).toEqual({ ...defaultHeaders, Authorization: 'Bearer 123' });

      reverb.version = '1.0';
      reverb.displayCurrency = 'CAD';
      reverb.shippingRegion = 'CA';
      reverb.locale = 'fr';

      expect(reverb.headers).toEqual({
        ...defaultHeaders,
        'Accept-Version': '1.0',
        'Accept-Language': 'fr',
        'X-Display-Currency': 'CAD',
        'X-Shipping-Region': 'CA',
        Authorization: 'Bearer 123',
      });
    });

    it('should get and set the version', () => {
      const reverb = new Reverb({ apiKey: '123' });
      expect(reverb.version).toBe('3.0');
      reverb.version = '1.0';
      expect(reverb.version).toBe('1.0');
    });

    it('should get and set the rootEndpoint', () => {
      const reverb = new Reverb({ apiKey: '123' });
      expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api');
      reverb.rootEndpoint = 'https://api.reverb.com/api2';
      expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api2');
    });

    it('should get and set the displayCurrency', () => {
      const reverb = new Reverb({ apiKey: '123' });
      expect(reverb.displayCurrency).toBe('USD');
      reverb.displayCurrency = 'CAD';
      expect(reverb.displayCurrency).toBe('CAD');
    });

    it('should get and set the shippingRegion', () => {
      const reverb = new Reverb({ apiKey: '123' });
      expect(reverb.shippingRegion).toBe(undefined);
      reverb.shippingRegion = 'CA';
      expect(reverb.shippingRegion).toBe('CA');
    });

    it('should get and set the locale', () => {
      const reverb = new Reverb({ apiKey: '123' });
      expect(reverb.locale).toBe('en');
      reverb.locale = 'fr';
      expect(reverb.locale).toBe('fr');
    });

    it.concurrent(
      'should be able to get listings',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.listings.getMy({});
        expect(response.status).toEqual(200);
      },
      60000,
    );

    it.concurrent(
      'should be able to get listings without options',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.listings.getMy();
        expect(response.status).toEqual(200);
      },
      60000,
    );

    it.concurrent(
      'should be able to get my orders',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.orders.getMy({});
        expect(response.status).toEqual(200);
      },
      60000,
    );

    it.concurrent(
      'should be able to get my orders without options',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.orders.getMy();
        expect(response.status).toEqual(200);
      },
      60000,
    );

    it.concurrent(
      'should be able to get arbitrary endpoints',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb._getArbitraryEndpoint('/');
        expect(response.status).toEqual(200);
      },
      60000,
    );

    it.concurrent(
      'should be able to get arbitrary endpoints on another domain',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb._getArbitraryEndpoint('https://www.google.com');
        expect(response.status).toEqual(200);
      },
      60000,
    );

    it.concurrent(
      'should be able to fetch a single listing given an id',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.listings.getOne({ id: '40000' });
        expect(response.status).toEqual(200);
        expect(response.data.id.toString()).toEqual('40000');
      },
      60000,
    );

    it(
      'should be able to fetch all listings in a given query',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.listings.getAllMy({ query: 'gibson' });

        const listingTitles = response.data.map((listing) => listing.title);
        const includesQuery = listingTitles
          .map((title) => title.toLowerCase().includes('gibson'))
          .every((result) => result === true);

        expect(response.status).toEqual(200);
        expect(response.data.length).toBeGreaterThan(0);
        expect(includesQuery).toBe(true);
      },
      60000,
    );

    it(
      'should be able to fetch all listings',
      async ({ expect }) => {
        const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
        const response = await reverb.listings.getAllMy();

        expect(response.status).toEqual(200);
        expect(response.data.length).toBeGreaterThan(0);
      },
      60000,
    );
  });
});
