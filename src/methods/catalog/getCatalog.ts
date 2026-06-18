import {
  Category,
  ListingCondition,
  ReverbShippingRegion,
  ListingCurrency,
} from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';
import Logger from '~/utils/logger';

export const getCategories = async (
  client: HttpClient,
  config: ReverbConfig,
): Promise<HttpResponse<Category[]>> => {
  const url = buildUrl(config.rootEndpoint, '/categories/flat');
  Logger.debug('Fetching categories with URL: %s', url);
  const response = await client.get<{ categories: Category[] }>(url, {
    headers: config.headers,
  });
  return { ...response, data: response.data?.categories || [] };
};

export const getConditions = async (
  client: HttpClient,
  config: ReverbConfig,
): Promise<HttpResponse<ListingCondition[]>> => {
  const url = buildUrl(config.rootEndpoint, '/listing_conditions');
  Logger.debug('Fetching listing conditions with URL: %s', url);
  const response = await client.get<{ conditions: ListingCondition[] }>(url, {
    headers: config.headers,
  });
  return { ...response, data: response.data?.conditions || [] };
};

export const getShippingRegions = async (
  client: HttpClient,
  config: ReverbConfig,
): Promise<HttpResponse<ReverbShippingRegion[]>> => {
  const url = buildUrl(config.rootEndpoint, '/shipping/regions');
  Logger.debug('Fetching shipping regions with URL: %s', url);
  const response = await client.get<{
    shipping_regions: ReverbShippingRegion[];
  }>(url, { headers: config.headers });
  return { ...response, data: response.data?.shipping_regions || [] };
};

export const getCurrencies = async (
  client: HttpClient,
  config: ReverbConfig,
): Promise<HttpResponse<ListingCurrency[]>> => {
  const url = buildUrl(config.rootEndpoint, '/currencies/listing');
  Logger.debug('Fetching listing currencies with URL: %s', url);
  const response = await client.get<{ currencies: ListingCurrency[] }>(url, {
    headers: config.headers,
  });
  return { ...response, data: response.data?.currencies || [] };
};
