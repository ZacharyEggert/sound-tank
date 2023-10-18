import type { Listing, ListingPostBody } from '../../types';

import Reverb from '~/Reverb';
import axios from 'axios';

/**
 * Posts a new listing to Reverb.
 * @param {Reverb} reverb - The Reverb API client.
 * @param {ListingPostBody} body - The listing data to post.
 * @returns {Promise<Listing>} - A promise that resolves to the newly created listing.
 */
export const postListing = async (reverb: Reverb, body: ListingPostBody) => {
  const { rootEndpoint, headers } = reverb;
  const response = await axios.post<Listing>(
    `${rootEndpoint}/listings`,
    JSON.stringify(body),
    { headers },
  );
  return response;
};
