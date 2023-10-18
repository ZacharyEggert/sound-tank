// import type {  } from '~/Reverb';

import { Order } from '~/types';
import { PaginatedReverbResponse } from '..';
import Reverb from '~/Reverb';
import axios from 'axios';

export interface GetMyOrdersOptions {
  page?: number;
  // perPage?: number;
  // status?: Order['status'] | 'all';
}

export const getMyOrders = async (
  reverb: Reverb,
  options: GetMyOrdersOptions,
) => {
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
