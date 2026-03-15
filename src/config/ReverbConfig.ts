import {
  ApiKey,
  ApiVersion,
  AuthReverbHeaders,
  DisplayCurrency,
  Locale,
  RootEndpoint,
  ShippingRegion,
} from '../Reverb';

export interface ReverbConfig {
  rootEndpoint: RootEndpoint;
  apiKey: ApiKey;
  headers: AuthReverbHeaders;
  version: ApiVersion;
  locale: Locale;
  displayCurrency: DisplayCurrency;
  shippingRegion?: ShippingRegion;
}

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
