export * from './listings/getListings';
export * from './listings/postListing';
export * from './orders/getOrders';
export type { PaginatedReverbResponse } from '~/types';

import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';

export type GetArbitraryEndpointOptions = {
  url: string;
  params?: { [key: string]: string };
};

export const getArbitraryEndpoint = async <T = any>(
  client: HttpClient,
  config: ReverbConfig,
  options: GetArbitraryEndpointOptions,
): Promise<HttpResponse<T>> => {
  const { url, params } = options;
  const requestUrl = url.startsWith('http') ? url : buildUrl(config.rootEndpoint, url);
  return client.get<T>(requestUrl, { headers: config.headers, params });
};
