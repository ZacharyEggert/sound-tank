import { Listing, ListingStates, PaginatedReverbResponse } from '~/types';
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  buildUrl,
  buildUrlWithQuery,
  paginateAll,
  paginateStream,
  createPaginatedResult,
} from '~/utils';
import Logger from '~/utils/logger';

export interface GetMyListingsOptions {
  page?: number;
  perPage?: number;
  query?: string;
  state?: string;
}

export const getMyListings = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetMyListingsOptions,
): Promise<HttpResponse<PaginatedReverbResponse<{ listings: Listing[] }>>> => {
  const { page, perPage, query, state } = options;

  const url = buildUrlWithQuery(buildUrl(config.rootEndpoint, '/my/listings'), {
    page,
    per_page: perPage,
    query,
    state,
  });
  Logger.debug('Fetching my listings with URL: %s', url);

  return client.get<PaginatedReverbResponse<{ listings: Listing[] }>>(url, {
    headers: config.headers,
  });
};

export interface GetAllMyListingsOptions {
  query?: string;
  state?: ListingStates;
}

export const getAllMyListings = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetAllMyListingsOptions,
): Promise<HttpResponse<Listing[]>> => {
  const { query, state } = options;

  const allListings = await paginateAll<Listing>(
    async (page, perPage) => {
      const response = await getMyListings(client, config, {
        page,
        perPage,
        query,
        state,
      });
      return createPaginatedResult(response.data.listings || [], perPage, page);
    },
    { perPage: 50, throttle: { delayMs: 5000, everyNPages: 5 } },
  );

  return {
    data: allListings,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
};

export async function* streamAllMyListings(
  client: HttpClient,
  config: ReverbConfig,
  options: GetAllMyListingsOptions,
): AsyncGenerator<Listing> {
  const { query, state } = options;

  const pages = paginateStream<Listing>(
    async (page, perPage) => {
      const response = await getMyListings(client, config, {
        page,
        perPage,
        query,
        state,
      });
      return createPaginatedResult(response.data.listings || [], perPage, page);
    },
    { perPage: 50, throttle: { delayMs: 5000, everyNPages: 5 } },
  );

  for await (const page of pages) {
    for (const listing of page) {
      yield listing;
    }
  }
}

export interface GetDraftsOptions {
  page?: number;
  perPage?: number;
}

export const getDrafts = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetDraftsOptions,
): Promise<HttpResponse<PaginatedReverbResponse<{ listings: Listing[] }>>> => {
  const { page, perPage } = options;

  const url = buildUrlWithQuery(
    buildUrl(config.rootEndpoint, '/my/listings/drafts'),
    { page, per_page: perPage },
  );
  Logger.debug('Fetching draft listings with URL: %s', url);

  return client.get<PaginatedReverbResponse<{ listings: Listing[] }>>(url, {
    headers: config.headers,
  });
};

export interface GetAllDraftsOptions {}

export const getAllDrafts = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetAllDraftsOptions,
): Promise<HttpResponse<Listing[]>> => {
  const allDrafts = await paginateAll<Listing>(
    async (page, perPage) => {
      const response = await getDrafts(client, config, { page, perPage });
      return createPaginatedResult(response.data.listings || [], perPage, page);
    },
    { perPage: 50, throttle: { delayMs: 5000, everyNPages: 5 } },
  );

  return {
    data: allDrafts,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
};

export async function* streamAllDrafts(
  client: HttpClient,
  config: ReverbConfig,
  options: GetAllDraftsOptions,
): AsyncGenerator<Listing> {
  const pages = paginateStream<Listing>(
    async (page, perPage) => {
      const response = await getDrafts(client, config, { page, perPage });
      return createPaginatedResult(response.data.listings || [], perPage, page);
    },
    { perPage: 50, throttle: { delayMs: 5000, everyNPages: 5 } },
  );

  for await (const page of pages) {
    for (const listing of page) {
      yield listing;
    }
  }
}

export interface GetOneListingOptions {
  id: string;
}

export const getOneListing = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetOneListingOptions,
): Promise<HttpResponse<Listing>> => {
  const { id } = options;
  const url = buildUrl(config.rootEndpoint, `/listings/${id}`);
  Logger.debug('Fetching listing with ID: %s using URL: %s', id, url);
  return client.get<Listing>(url, { headers: config.headers });
};

export interface GetOneListingPhotosOptions {
  id: string;
}

export const getOneListingPhotos = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetOneListingPhotosOptions,
): Promise<HttpResponse<{ photos: string[] }>> => {
  const { id } = options;

  const oneListingResponse = await getOneListing(client, config, { id });

  const photos =
    oneListingResponse.data?.photos?.map((photo) => photo._links.full.href) ||
    [];
  Logger.debug('Fetched %d photos for listing with ID: %s', photos.length, id);

  return {
    data: { photos },
    status: oneListingResponse.status,
    statusText: oneListingResponse.statusText,
    headers: oneListingResponse.headers,
    config: oneListingResponse.config,
  };
};
