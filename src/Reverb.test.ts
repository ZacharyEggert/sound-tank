import { expect, it, suite } from 'vitest';

import Reverb from './Reverb';

const defaultHeaders = Reverb.defaultHeaders;

suite('Reverb', () => {
  it('should throw if no api key is given', () => {
    // throws if there is no api key
    // @ts-ignore
    expect(() => new Reverb({})).toThrow('Reverb: apiKey is required');
  });

  it('should set the default endpoint', () => {
    // initialize client with api key
    const reverb = new Reverb({ apiKey: '123' });

    // rootEndpoint should be set to default
    expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api');
  });

  it('should set the default version', () => {
    // initialize client with api key
    const reverb = new Reverb({ apiKey: '123' });

    // version should be set to default
    expect(reverb.version).toBe('3.0');
  });

  it('should set the default headers', () => {
    // initialize client with api key
    const reverb = new Reverb({ apiKey: '123' });

    // headers should be set to default
    expect(reverb.headers).toEqual({
      ...defaultHeaders,
      Authorization: 'Bearer 123',
    });
  });

  it('should set the headers with the given options', () => {
    // initialize client with api key
    const reverb = new Reverb({
      apiKey: '123',
      version: '1.0',
      displayCurrency: 'CAD',
      shippingRegion: 'CA',
      locale: 'fr',
    });

    // headers should be set to given options
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
    // initialize client with api key
    const reverb = new Reverb({
      apiKey: '123',
      displayCurrency: 'CAD',
      locale: 'fr',
    });

    const reverb2 = new Reverb({
      apiKey: '123',
    });

    // displayCurrency should be set to given currency
    // locale should be set to given locale
    expect(reverb.displayCurrency).toBe('CAD');
    expect(reverb.locale).toBe('fr');
    expect(reverb.headers).toEqual({
      ...defaultHeaders,
      'Accept-Language': 'fr',
      'X-Display-Currency': 'CAD',
      Authorization: 'Bearer 123',
    });

    // displayCurrency should be set to default
    // locale should be set to default
    expect(reverb2.displayCurrency).toBe('USD');
    expect(reverb2.locale).toBe('en');
    expect(reverb2._headers).toEqual({
      ...defaultHeaders,
      Authorization: 'Bearer 123',
    });
  });

  it('should set the default endpoint if provided', () => {
    // initialize client with api key
    const reverb = new Reverb({
      apiKey: '123',
      rootEndpoint: 'https://api.reverb.com/api2',
    });

    // rootEndpoint should be set to given endpoint
    expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api2');
  });

  suite('Getters and Setters', () => {
    it('setters should update the headers when any option is updated', () => {
      // initialize client with api key
      const reverb = new Reverb({ apiKey: '123' });

      // headers should be set to default
      expect(reverb.headers).toEqual({
        ...defaultHeaders,
        Authorization: 'Bearer 123',
      });

      // update options
      reverb.version = '1.0';
      reverb.displayCurrency = 'CAD';
      reverb.shippingRegion = 'CA';
      reverb.locale = 'fr';

      // headers should be updated
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
      // initialize client with api key
      const reverb = new Reverb({ apiKey: '123' });

      // version should be set to default
      expect(reverb.version).toBe('3.0');
      // update version
      reverb.version = '1.0';
      // version should be updated
      expect(reverb.version).toBe('1.0');
    });

    it('should get and set the rootEndpoint', () => {
      // initialize client with api key
      const reverb = new Reverb({ apiKey: '123' });

      // rootEndpoint should be set to default
      expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api');
      // update rootEndpoint
      reverb.rootEndpoint = 'https://api.reverb.com/api2';
      // rootEndpoint should be updated
      expect(reverb.rootEndpoint).toBe('https://api.reverb.com/api2');
    });

    it('should get and set the displayCurrency', () => {
      // initialize client with api key
      const reverb = new Reverb({ apiKey: '123' });

      // displayCurrency should be set to default
      expect(reverb.displayCurrency).toBe('USD');
      // update displayCurrency
      reverb.displayCurrency = 'CAD';
      // displayCurrency should be updated
      expect(reverb.displayCurrency).toBe('CAD');
    });

    it('should get and set the shippingRegion', () => {
      // initialize client with api key
      const reverb = new Reverb({ apiKey: '123' });

      // shippingRegion should be set to default
      expect(reverb.shippingRegion).toBe(undefined);
      // update shippingRegion
      reverb.shippingRegion = 'CA';
      // shippingRegion should be updated
      expect(reverb.shippingRegion).toBe('CA');
    });

    it('should get and set the locale', () => {
      // initialize client with api key
      const reverb = new Reverb({ apiKey: '123' });

      // locale should be set to default
      expect(reverb.locale).toBe('en');
      // update locale
      reverb.locale = 'fr';
      // locale should be updated
      expect(reverb.locale).toBe('fr');
    });
  });
});
