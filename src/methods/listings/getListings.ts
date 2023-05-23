// import type {  } from '~/Reverb';

import { Listing } from '~/types';
import { PaginatedReverbResponse } from '..';
import Reverb from '~/Reverb';
import axios from 'axios';

export interface GetMyListingsOptions {
  page?: number;
  perPage?: number;
  query?: string;
  sku?: string;
  state?: string;
}

export const getMyListings = async (
  reverb: Reverb,
  options: GetMyListingsOptions,
) => {
  const { page, perPage, query, sku, state } = options;

  const baseUrl = `${reverb.rootEndpoint}/my/listings`;
  const pageString = page ? `&page=${page}` : '';
  const perPageString = perPage ? `&per_page=${perPage}` : '';
  const queryString = query ? `&query=${query}` : '';
  const skuString = sku ? `&sku=${sku}` : '';
  const stateString = state ? `&state=${state}` : '';

  const url = `${baseUrl}?${pageString}${perPageString}${queryString}${skuString}${stateString}`;

  const response = await axios.get<
    PaginatedReverbResponse<{ listings: Listing[] }>
  >(url, {
    headers: reverb.headers,
  });

  return response;
};
