// import type {  } from '~/Reverb';

import axios, { AxiosResponse } from 'axios';

import { Order } from '~/types';
import { PaginatedReverbResponse } from '..';
import Reverb from '~/Reverb';

export interface GetMyOrdersOptions {
  page?: number;
  // perPage?: number;
  // status?: Order['status'] | 'all';
}

/**
 * Retrieves a paginated list of orders for the authenticated user.
 * @param {Reverb} reverb - The Reverb instance to use for the API request.
 * @param {GetMyOrdersOptions} options - The options to use for the API request.
 * @returns {Promise<AxiosResponse<PaginatedReverbResponse<{ orders: Order[] }>>>} A Promise that resolves to the API response containing the list of orders.
 */
export const getMyOrders = async (
  reverb: Reverb,
  options: GetMyOrdersOptions,
): Promise<AxiosResponse<PaginatedReverbResponse<{ orders: Order[]; }>>> => {
  const { page } = options;

  const baseUrl = `${reverb.rootEndpoint}/my/orders/selling/all`;
  const pageString = page ? `&page=${page}` : '';

  const url = `${baseUrl}?${pageString}`;

  const response = await axios.get<
    PaginatedReverbResponse<{ orders: Order[] }>
  >(url, {
    headers: reverb.headers,
  });

  return response;
};
