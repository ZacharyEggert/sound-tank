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
  const { url, ...requestConfig } = options;

  // check if url is absolute
  const isAbsoluteUrl = url.startsWith('http');
  //check if url has / at the beginning
  const hasSlash = url.startsWith('/');
  const requestUrl = isAbsoluteUrl
    ? url
    : `${reverb.rootEndpoint}${hasSlash ? '' : '/'}${url}`;

  const response = await axios.get<T>(requestUrl, {
    headers: reverb.headers,
    ...requestConfig,
  });

  return response;
};
