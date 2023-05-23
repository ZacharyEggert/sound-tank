import { expect, it, suite } from 'vitest';

import { Order } from '~/types';
import Reverb from '../../Reverb';
import { config } from 'dotenv';
import { getMyOrders } from '../';

config();

suite(
  'getMyOrders',
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });

    it.concurrent('should return a list of orders', async ({ expect }) => {
      const response = await getMyOrders(reverb, {});

      console.log(response.data.orders[0]);
      expect(response.data.orders).toBeDefined();
    });
  },
  { timeout: 60000 },
);
