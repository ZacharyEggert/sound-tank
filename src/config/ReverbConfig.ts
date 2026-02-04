import {
  ApiKey,
  ApiVersion,
  AuthReverbHeaders,
  DisplayCurrency,
  Locale,
  RootEndpoint,
  ShippingRegion,
} from '../Reverb';

/**
 * Configuration object for Reverb API operations.
 * This contains all necessary settings to make API requests without requiring
 * the entire Reverb instance to be passed around.
 */
export interface ReverbConfig {
  /**
   * The root API endpoint URL
   */
  rootEndpoint: RootEndpoint;

  /**
   * The API key for authentication
   */
  apiKey: ApiKey;

  /**
   * Complete headers including authentication
   */
  headers: AuthReverbHeaders;

  /**
   * API version to use
   */
  version: ApiVersion;

  /**
   * Locale for API responses
   */
  locale: Locale;

  /**
   * Display currency for prices
   */
  displayCurrency: DisplayCurrency;

  /**
   * Optional shipping region
   */
  shippingRegion?: ShippingRegion;
}

/**
 * Creates a ReverbConfig from individual configuration values.
 * This is a helper function to construct the config object with proper typing.
 */
export function createReverbConfig(params: {
  rootEndpoint: RootEndpoint;
  apiKey: ApiKey;
  headers: AuthReverbHeaders;
  version: ApiVersion;
  locale: Locale;
  displayCurrency: DisplayCurrency;
  shippingRegion?: ShippingRegion;
}): ReverbConfig {
  return {
    rootEndpoint: params.rootEndpoint,
    apiKey: params.apiKey,
    headers: params.headers,
    version: params.version,
    locale: params.locale,
    displayCurrency: params.displayCurrency,
    shippingRegion: params.shippingRegion,
  };
}
