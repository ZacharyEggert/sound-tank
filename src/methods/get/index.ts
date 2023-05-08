export * from './getListings';

import Reverb from '~/Reverb';
import axios from 'axios';

export const getMyRoot = async <T = any>(reverb: Reverb) => {
  const url = `${reverb.rootEndpoint}/`;
  const response = await axios.get<T>(url, {
    headers: reverb.headers,
  });
  return response;
};
