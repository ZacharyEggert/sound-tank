export * from './listings/getListings';
export * from './orders/getOrders';

import axios, { AxiosResponse } from 'axios';

import { Link } from '~/types';
import Reverb from '~/Reverb';

/**
 * Retrieves the root endpoint of the Reverb API.
 * @param {Reverb} reverb - The Reverb instance to use for the request.
 * @returns {Promise<AxiosResponse<T>>} A Promise that resolves with the root endpoint data.
 * @template T - The type of the response data.
 */
export const getMyRoot = async <T = any>(reverb: Reverb): Promise<AxiosResponse<T>> => {
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
  url: string ;
  params?: {
    [key: string]: string;
  };
};

/**
 * Makes a GET request to an arbitrary endpoint.
 * @param {Reverb} reverb - The Reverb instance to use for the request.
 * @param {GetArbitraryEndpointOptions} options - The options for the request, including the URL and any additional request configuration.
 * @returns {Promise<AxiosResponse<T>>} A Promise that resolves with the response data.
 * @template T - The type of the response data.
 */
export const getArbitraryEndpoint = async <T = any>(
  reverb: Reverb,
  options: GetArbitraryEndpointOptions,
): Promise<AxiosResponse<T>> => {
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
