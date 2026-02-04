import * as methods from './methods';

import { Axios } from 'axios';
import { ReverbConfig, createReverbConfig } from './config/ReverbConfig';
import { AxiosHttpClient, HttpClient } from './http';

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
  private _config!: ReverbConfig;
  private _httpClient: HttpClient;

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

    // Initialize HTTP client
    this._httpClient = new AxiosHttpClient();

    this.updateHeaders();
    this._updateConfig();
  }

	/**
	 * Updates the headers based on the current state of the Reverb instance.
	 * This method is called whenever a property that affects the headers is changed, rather than every time a request is made.
	 */
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

  /**
   * Updates the internal config object based on current state.
   * This is called whenever configuration-related properties change.
   */
  private _updateConfig() {
    this._config = createReverbConfig({
      rootEndpoint: this._rootEndpoint,
      apiKey: this.apiKey,
      headers: this._headers,
      version: this._version,
      locale: this._locale,
      displayCurrency: this._displayCurrency,
      shippingRegion: this._shippingRegion,
    });
  }

  set locale(locale: Locale) {
    this._locale = locale;
    this.updateHeaders();
    this._updateConfig();
  }
  get locale() {
    return this._locale;
  }

  set shippingRegion(shippingRegion: ShippingRegion | undefined) {
    this._shippingRegion = shippingRegion;
    this.updateHeaders();
    this._updateConfig();
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
    this._updateConfig();
  }
  get displayCurrency(): DisplayCurrency {
    return this._displayCurrency;
  }

  set version(version: ApiVersion) {
    this._version = version;
    this.updateHeaders();
    this._updateConfig();
  }
  get version(): ApiVersion {
    return this._version;
  }

  set rootEndpoint(rootEndpoint: RootEndpoint) {
    this._rootEndpoint = rootEndpoint;
    this._updateConfig();
  }
  get rootEndpoint(): RootEndpoint {
    return this._rootEndpoint;
  }

  /**
   * Gets the current configuration object.
   * This provides access to all configuration values in a single object,
   * useful for passing to methods without requiring the entire Reverb instance.
   */
  get config(): ReverbConfig {
    return this._config;
  }

  /**
   * Retrieves the current user's listings.
   * @param {methods.GetMyListingsOptions} options - Optional parameters for the request.
   * @returns {Promise<AxiosResponse<PaginatedReverbResponse<{ listings: Listing[] }>>>} A Promise that resolves to the user's listings. Structured as an axios response
   */
  async getMyListings(options?: methods.GetMyListingsOptions) {
    return await methods.getMyListings(this, options ?? {});
  }

  /**
   * Retrieves the orders for the current user.
   * @param {methods.GetMyOrdersOptions} options - An optional object containing options for the request.
   * @returns {Promise<AxiosResponse<PaginatedReverbResponse<{ orders: Order[] }>>>} A Promise that resolves with the user's orders. Structured as an axios response
   */
  async getMyOrders(options?: methods.GetMyOrdersOptions) {
    return await methods.getMyOrders(this, options ?? {});
  }

  /**
   * Retrieves an arbitrary endpoint using the provided options.
   * @param {methods.GetArbitraryEndpointOptions} options - The options to use when retrieving the endpoint.
   * @returns {Promise<AxiosResponse<unknown>>} A Promise that resolves with the retrieved endpoint. Structured as an axios response
   */
  async getArbitraryEndpoint(options: methods.GetArbitraryEndpointOptions) {
    return await methods.getArbitraryEndpoint(this, options);
  }

  /**
   * Retrieves a single listing based on the provided options.
   * @param {methods.GetOneListingOptions} options - The options to use when retrieving the listing.
   * @returns {Promise<AxiosResponse<Listing>>} A Promise that resolves with the retrieved listing.
   */
  async getOneListing(options: methods.GetOneListingOptions) {
    return await methods.getOneListing(this, options);
  }

  /**
   * Retrieves all listings associated with the current user.
   * @param {methods.GetAllMyListingsOptions} options - An optional object containing options for the request.
   * @returns {Promise<AxiosResponse<PaginatedReverbResponse<{ listings: Listing[] }>>>} A Promise that resolves with an array of listings.
   */
  async getAllMyListings(options?: methods.GetAllMyListingsOptions) {
    return await methods.getAllMyListings(this, options ?? {});
  }
}
