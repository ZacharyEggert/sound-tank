import { Axios } from 'axios';
import { ReverbConfig, createReverbConfig } from './config/ReverbConfig';
import { AxiosHttpClient, HttpClient } from './http';
import { ListingsResource } from './resources/ListingsResource';
import { OrdersResource } from './resources/OrdersResource';
import { NegotiationsResource } from './resources/NegotiationsResource';
import { getArbitraryEndpoint, GetArbitraryEndpointOptions } from './methods';
import Logger from './utils/logger';

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

  readonly listings: ListingsResource;
  readonly orders: OrdersResource;
  readonly negotiations: NegotiationsResource;
  constructor(options: ReverbOptions) {
    const {
      apiKey,
      version,
      rootEndpoint: defaultEndpoint,
      displayCurrency,
      shippingRegion,
      locale,
    } = options;

    if (!apiKey || apiKey === '') {
      throw new Error('Reverb: apiKey is required');
    }

    if (version) this._version = version;
    if (defaultEndpoint) this._rootEndpoint = defaultEndpoint;
    if (displayCurrency) this._displayCurrency = displayCurrency;
    if (shippingRegion) this._shippingRegion = shippingRegion;
    if (locale) this._locale = locale;

    this.apiKey = apiKey;
    this._headers = {
      ...Reverb.defaultHeaders,
      Authorization: `Bearer ${this.apiKey}`,
    };

    this._httpClient = new AxiosHttpClient();
    this.updateHeaders();
    this._updateConfig();

    this.listings = new ListingsResource(
      () => this._httpClient,
      () => this._config,
    );
    this.orders = new OrdersResource(
      () => this._httpClient,
      () => this._config,
    );
    this.negotiations = new NegotiationsResource(
      () => this._httpClient,
      () => this._config,
    );
		
    Logger.trace('Reverb client initialized with config: %o', this._config);
  }

  private updateHeaders() {
    const optionalHeaders = {} as any;
    if (this._shippingRegion)
      optionalHeaders['X-Shipping-Region'] = this._shippingRegion;

    Logger.debug(
      'Updating headers with API key and config values. Shipping region included: %s',
      !!this._shippingRegion,
    );

    this._headers = {
      ...this._headers,
      Authorization: `Bearer ${this.apiKey}`,
      'Accept-Version': this._version,
      'X-Display-Currency': this._displayCurrency,
      'Accept-Language': this._locale,
      ...optionalHeaders,
    };
  }

  private _updateConfig() {
    Logger.debug(
      'Updating Reverb config with current settings. Root endpoint: %s, Version: %s, Display currency: %s, Locale: %s, Shipping region: %s',
      this._rootEndpoint,
      this._version,
      this._displayCurrency,
      this._locale,
      this._shippingRegion,
    );

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
    Logger.debug('Setting locale to: %s', locale);

    this._locale = locale;
    this.updateHeaders();
    this._updateConfig();
  }
  get locale() {
    return this._locale;
  }

  set shippingRegion(shippingRegion: ShippingRegion | undefined) {
    Logger.debug('Setting shipping region to: %s', shippingRegion);

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
    Logger.debug('Setting display currency to: %s', displayCurrency);

    this._displayCurrency = displayCurrency;
    this.updateHeaders();
    this._updateConfig();
  }
  get displayCurrency(): DisplayCurrency {
    return this._displayCurrency;
  }

  set version(version: ApiVersion) {
    Logger.debug('Setting API version to: %s', version);

    this._version = version;
    this.updateHeaders();
    this._updateConfig();
  }
  get version(): ApiVersion {
    return this._version;
  }

  set rootEndpoint(rootEndpoint: RootEndpoint) {
    Logger.debug('Setting root endpoint to: %s', rootEndpoint);

    this._rootEndpoint = rootEndpoint;
    this._updateConfig();
  }
  get rootEndpoint(): RootEndpoint {
    return this._rootEndpoint;
  }

  get config(): ReverbConfig {
    return this._config;
  }

  async _getArbitraryEndpoint<T = any>(
    url: string,
    params?: GetArbitraryEndpointOptions['params'],
  ) {
    return getArbitraryEndpoint<T>(this._httpClient, this._config, {
      url,
      params,
    });
  }
}
