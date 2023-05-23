import type { Listing, ListingPostBody } from '../../types';

import Reverb from '~/Reverb';
import axios from 'axios';

export const postListing = async (reverb: Reverb, body: ListingPostBody) => {
  const { rootEndpoint, headers } = reverb;
  const response = await axios.post<Listing>(
    `${rootEndpoint}/listings`,
    JSON.stringify(body),
    { headers },
  );
  return response;
};
