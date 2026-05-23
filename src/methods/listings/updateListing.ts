import type { Listing, ListingUpdateBody } from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';
import Logger from '~/utils/logger';

export const updateListing = async (
  client: HttpClient,
  config: ReverbConfig,
  id: string,
  body: ListingUpdateBody,
): Promise<HttpResponse<Listing>> => {
  const url = buildUrl(config.rootEndpoint, `/listings/${id}`);
  Logger.debug('Updating listing %s with URL: %s and body: %o', id, url, body);
  return client.put<Listing>(url, JSON.stringify(body), {
    headers: config.headers,
  });
};
