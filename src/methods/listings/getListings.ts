// import type {  } from '~/Reverb';

import axios, { AxiosResponse } from 'axios';

import { Listing } from '~/types';
import { PaginatedReverbResponse } from '..';
import Reverb from '~/Reverb';

export interface GetMyListingsOptions {
  page?: number;
  perPage?: number;
  query?: string;
  // sku?: string;
  state?: string;
}

/**
 * Retrieves a paginated list of the authenticated user's listings on Reverb.
 *
 * @param reverb - The Reverb client instance.
 * @param options - The options to use when fetching the listings.
 * @returns A Promise that resolves to the paginated response containing the user's listings.
 */
export const getMyListings = async (
  reverb: Reverb,
  options: GetMyListingsOptions,
) => {
  const { page, perPage, query, state } = options;

  const baseUrl = `${reverb.rootEndpoint}/my/listings`;
  const pageString = page ? `&page=${page}` : '';
  const perPageString = perPage ? `&per_page=${perPage}` : '';
  const queryString = query ? `&query=${query}` : '';
  // const skuString = sku ? `&sku=${sku}` : '';
  const stateString = state ? `&state=${state}` : '';

  const url = `${baseUrl}?${pageString}${perPageString}${queryString}${stateString}`;

  const response = await axios.get<
    PaginatedReverbResponse<{ listings: Listing[] }>
  >(url, {
    headers: reverb.headers,
  });

  return response;
};

export interface GetAllMyListingsOptions {
  query?: string;
  // sku?: string;
  state?: string;
}

export const getAllMyListings = async (
  reverb: Reverb,
  options: GetAllMyListingsOptions,
): Promise<AxiosResponse<Listing[]>> => {
  let page = 1;
  const perPage = 50;

  const { query, state } = options;

  let listings: Listing[] = [];
  let response;

  do {
    response = await getMyListings(reverb, { page, perPage, query, state });
    listings = listings.concat(response.data.listings);
    page++;
  } while (response.data.listings.length === perPage);

  return { ...response, data: listings };
};

export interface GetOneListingOptions {
  id: string;
}

/**
 * Retrieves a single Reverb listing by ID.
 * @param reverb - The Reverb instance to use for the API request.
 * @param options - The options for the API request, including the ID of the listing to retrieve.
 * @returns A Promise that resolves with the retrieved listing. Structured as an axios response
 */
export const getOneListing = async (
  reverb: Reverb,
  options: GetOneListingOptions,
) => {
  const { id } = options;

  const baseUrl = `${reverb.rootEndpoint}/listings/${id}`;

  const response = await axios.get<Listing>(baseUrl, {
    headers: reverb.headers,
  });

  return response;
};
