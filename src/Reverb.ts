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

export interface ReverbHeaders {
  'Content-Type': string;
  'Accept-Version': ApiVersion;
  Accept: string;
  'Accept-Language': Locale;
  'X-Display-Currency': DisplayCurrency;
  'X-Shipping-Region'?: ShippingRegion | undefined;
  'User-Agent'?: string;
}

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
  _headers: AuthReverbHeaders;
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

  set shippingRegion(shippingRegion: ShippingRegion) {
    this._shippingRegion = shippingRegion;
    this.updateHeaders();
  }
  get shippingRegion(): ShippingRegion | undefined {
    return this._shippingRegion;
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
}
