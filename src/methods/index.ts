export * from './listings/getListings';
export * from './orders/getOrders';

import { Link } from '~/types';
import Reverb from '~/Reverb';
import axios from 'axios';

export const getMyRoot = async <T = any>(reverb: Reverb) => {
  const url = `${reverb.rootEndpoint}/`;
  const response = await axios.get<T>(url, {
    headers: reverb.headers,
  });
  return response;
};

export type PaginatedReverbResponse<T> = T & {
  total: number;
  current_page: number;
  total_pages: number;
  _links: {
    next?: Link;
    prev?: Link;
  };
};

export type GetArbitraryEndpointOptions = {
  url: string;
  params?: {
    [key: string]: string;
  };
};

export const getArbitraryEndpoint = async <T = any>(
  reverb: Reverb,
  options: GetArbitraryEndpointOptions,
) => {
  const { url, params } = options;

  const response = await axios.get<T>(url, {
    headers: reverb.headers,
    params,
  });

  return response;
};
