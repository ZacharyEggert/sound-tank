import { Order, PaginatedReverbResponse } from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl, buildUrlWithQuery } from '~/utils';
import Logger from '~/utils/logger';

export interface GetMyOrdersOptions {
  page?: number;
}

export const getMyOrders = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetMyOrdersOptions,
): Promise<HttpResponse<PaginatedReverbResponse<{ orders: Order[] }>>> => {
  const { page } = options;

  const url = buildUrlWithQuery(
    buildUrl(config.rootEndpoint, '/my/orders/selling/all'),
    { page },
  );

	Logger.debug('Fetching my orders with URL: %s', url);

  return client.get<PaginatedReverbResponse<{ orders: Order[] }>>(url, {
    headers: config.headers,
  });
};
