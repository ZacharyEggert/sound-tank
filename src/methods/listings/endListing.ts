import type { Listing, EndListingReason } from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';
import Logger from '~/utils/logger';

export const endListing = async (
  client: HttpClient,
  config: ReverbConfig,
  id: string,
  reason: EndListingReason,
): Promise<HttpResponse<Listing>> => {
  const url = buildUrl(config.rootEndpoint, `/my/listings/${id}/state/end`);
  Logger.debug('Ending listing %s with reason: %s, URL: %s', id, reason, url);
  return client.put<Listing>(url, JSON.stringify({ reason }), {
    headers: config.headers,
  });
};

export const deleteListing = async (
  client: HttpClient,
  config: ReverbConfig,
  id: string,
): Promise<HttpResponse<void>> => {
  const url = buildUrl(config.rootEndpoint, `/listings/${id}`);
  Logger.debug('Deleting listing %s with URL: %s', id, url);
  return client.delete<void>(url, {
    headers: config.headers,
  });
};
