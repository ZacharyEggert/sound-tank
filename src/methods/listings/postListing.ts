import type { Listing, ListingPostBody } from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';
import Logger from '~/utils/logger';

export const postListing = async (
  client: HttpClient,
  config: ReverbConfig,
  body: ListingPostBody,
): Promise<HttpResponse<Listing>> => {
  const url = buildUrl(config.rootEndpoint, '/listings');
	Logger.debug('Posting new listing with URL: %s and body: %o', url, body);
  return client.post<Listing>(url, JSON.stringify(body), { headers: config.headers });
};
