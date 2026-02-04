import type { Listing, ListingPostBody } from '../../types';
import axios, {AxiosResponse} from 'axios';

import Reverb from '~/Reverb';

/**
 * Posts a new listing to Reverb.
 * @param {Reverb} reverb - The Reverb API client.
 * @param {ListingPostBody} body - The listing data to post.
 * @returns {Promise<AxiosResponse<Listing>>} - A promise that resolves to the newly created listing.
 * @throws Will throw an axios error if the request fails.
 */
export const postListing = async (reverb: Reverb, body: ListingPostBody): Promise<AxiosResponse<Listing>> => {
  const { rootEndpoint, headers } = reverb;
  const response = await axios.post<Listing>(
    `${rootEndpoint}/listings`,
    JSON.stringify(body),
    { headers },
  );
  return response;
};
