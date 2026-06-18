import type { ListingImage, Listing } from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';
import Logger from '~/utils/logger';

export const getListingImages = async (
  client: HttpClient,
  config: ReverbConfig,
  id: string,
): Promise<HttpResponse<ListingImage[]>> => {
  const url = buildUrl(config.rootEndpoint, `/listings/${id}/images`);
  Logger.debug('Fetching images for listing %s with URL: %s', id, url);
  const response = await client.get<{ images: ListingImage[] }>(url, {
    headers: config.headers,
  });
  return {
    ...response,
    data: response.data?.images || [],
  };
};

export const deleteListingPhoto = async (
  client: HttpClient,
  config: ReverbConfig,
  id: string,
  imageId: string,
): Promise<HttpResponse<void>> => {
  const url = buildUrl(
    config.rootEndpoint,
    `/listings/${id}/images/${imageId}`,
  );
  Logger.debug(
    'Deleting photo %s from listing %s with URL: %s',
    imageId,
    id,
    url,
  );
  return client.delete<void>(url, { headers: config.headers });
};

export const reorderListingPhotos = async (
  client: HttpClient,
  config: ReverbConfig,
  id: string,
  photoUrls: string[],
): Promise<HttpResponse<Listing>> => {
  const url = buildUrl(config.rootEndpoint, `/listings/${id}`);
  Logger.debug('Reordering photos for listing %s with URL: %s', id, url);
  return client.put<Listing>(
    url,
    JSON.stringify({ photos: photoUrls, photo_upload_method: 'override_position' }),
    { headers: config.headers },
  );
};
