import * as methods from './methods';

import { Axios } from 'axios';

export type ApiVersion = string;
export type ApiKey = string;
export type Locale = string;
export type ShippingRegion = string;
export type DisplayCurrency = string;
export type RootEndpoint = Domain;

type Domain = `${string}.${string}` | `${string}.${string}.${string}`;

export interface ReverbOptions {
  apiKey: ApiKey;
  version?: ApiVersion | undefined;
  rootEndpoint?: RootEndpoint | undefined;
  displayCurrency?: DisplayCurrency | undefined;
  shippingRegion?: ShippingRegion | undefined;
  locale?: Locale | undefined;
}

export type ReverbHeaders = Axios['get']['arguments'][1] & {
  'Content-Type': string;
  'Accept-Version': ApiVersion;
  Accept: string;
  'Accept-Language': Locale;
  'X-Display-Currency': DisplayCurrency;
  'X-Shipping-Region'?: ShippingRegion | undefined;
  'User-Agent'?: string;
};

export interface AuthReverbHeaders extends ReverbHeaders {
  Authorization: `Bearer ${ApiKey}`;
}

export default class Reverb {
  static defaultHeaders: ReverbHeaders = {
    'Content-Type': 'application/hal+json',
    'Accept-Version': '3.0',
    Accept: 'application/hal+json',
    'Accept-Language': 'en',
    'X-Display-Currency': 'USD',
    // 'X-Shipping-Region': undefined
    'User-Agent': 'Reverb Node SDK',
  };

  private _rootEndpoint: RootEndpoint = 'https://api.reverb.com/api';
  private _version: ApiVersion = Reverb.defaultHeaders['Accept-Version'];
  private apiKey: string;
  private _headers: AuthReverbHeaders;
  private _displayCurrency: DisplayCurrency =
    Reverb.defaultHeaders['X-Display-Currency'];
  private _shippingRegion: ShippingRegion | undefined;
  private _locale: Locale = Reverb.defaultHeaders['Accept-Language'];

  constructor(options: ReverbOptions) {
    const {
      apiKey,
      version,
      rootEndpoint: defaultEndpoint,
      displayCurrency,
      shippingRegion,
      locale,
    } = options;

    // throw if no api key
    if (!apiKey || apiKey === '') {
      throw new Error('Reverb: apiKey is required');
    }

    // set version and default endpoint if provided
    if (version) {
      this._version = version;
    }
    if (defaultEndpoint) {
      this._rootEndpoint = defaultEndpoint;
    }
    if (displayCurrency) {
      this._displayCurrency = displayCurrency;
    }
    if (shippingRegion) {
      this._shippingRegion = shippingRegion;
    }
    if (locale) {
      this._locale = locale;
    }

    // set api key
    this.apiKey = apiKey;

    this._headers = {
      ...Reverb.defaultHeaders,
      Authorization: `Bearer ${this.apiKey}`,
    };

    this.updateHeaders();
  }

  private updateHeaders() {
    const optionalHeaders = {} as any;

    if (this._shippingRegion)
      optionalHeaders['X-Shipping-Region'] = this._shippingRegion;

    this._headers = {
      ...this._headers,
      Authorization: `Bearer ${this.apiKey}`,
      'Accept-Version': this._version,
      'X-Display-Currency': this._displayCurrency,
      'Accept-Language': this._locale,
      ...optionalHeaders,
    };
  }

  set locale(locale: Locale) {
    this._locale = locale;
    this.updateHeaders();
  }
  get locale() {
    return this._locale;
  }

  set shippingRegion(shippingRegion: ShippingRegion | undefined) {
    this._shippingRegion = shippingRegion;
    this.updateHeaders();
  }
  get shippingRegion(): ShippingRegion | undefined {
    return this._shippingRegion;
  }

  get headers(): AuthReverbHeaders {
    return this._headers;
  }

  set displayCurrency(displayCurrency: DisplayCurrency) {
    this._displayCurrency = displayCurrency;
    this.updateHeaders();
  }
  get displayCurrency(): DisplayCurrency {
    return this._displayCurrency;
  }

  set version(version: ApiVersion) {
    this._version = version;
    this.updateHeaders();
  }
  get version(): ApiVersion {
    return this._version;
  }

  set rootEndpoint(rootEndpoint: RootEndpoint) {
    this._rootEndpoint = rootEndpoint;
    // this.updateHeaders();
  }
  get rootEndpoint(): RootEndpoint {
    return this._rootEndpoint;
  }

  /**
   * Retrieves the current user's listings.
   * @param options - Optional parameters for the request.
   * @returns A Promise that resolves to the user's listings. Structured as an axios response
   */
  async getMyListings(options?: methods.GetMyListingsOptions) {
    return await methods.getMyListings(this, options ?? {});
  }

  /**
   * Retrieves the orders for the current user.
   * @param options - An optional object containing options for the request.
   * @returns A Promise that resolves with the user's orders. Structured as an axios response
   */
  async getMyOrders(options?: methods.GetMyOrdersOptions) {
    return await methods.getMyOrders(this, options ?? {});
  }

  /**
   * Retrieves an arbitrary endpoint using the provided options.
   * @param options - The options to use when retrieving the endpoint.
   * @returns A Promise that resolves with the retrieved endpoint. Structured as an axios response
   */
  async getArbitraryEndpoint(options: methods.GetArbitraryEndpointOptions) {
    return await methods.getArbitraryEndpoint(this, options);
  }

  /**
   * Retrieves a single listing based on the provided options.
   * @param options - The options to use when retrieving the listing.
   * @returns A Promise that resolves with the retrieved listing.
   */
  async getOneListing(options: methods.GetOneListingOptions) {
    return await methods.getOneListing(this, options);
  }

  /**
   * Retrieves all listings associated with the current user.
   * @param options - An optional object containing options for the request.
   * @returns A Promise that resolves with an array of listings.
   */
  async getAllMyListings(options?: methods.GetAllMyListingsOptions) {
    return await methods.getAllMyListings(this, options ?? {});
  }
}
