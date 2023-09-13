import { describe, expect, it } from 'bun:test';

import { Order } from '~/types';
import Reverb from '../../Reverb';
import { config } from 'dotenv';
import { getMyOrders } from '../';

config();

describe('getMyOrders', () => {
  const { REVERB_API_KEY } = process.env;
  const reverb = new Reverb({ apiKey: REVERB_API_KEY });

  it('should return a list of orders', async () => {
    const response = await getMyOrders(reverb, {});

    // console.log(response.data.orders[0]);
    expect(response.data.orders).toBeDefined();
  });
});
