import { expect, it, suite } from 'vitest';

import Reverb from '../../../src/Reverb';
import { config } from 'dotenv';

config();

suite(
  'orders.getMy',
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });

    it.concurrent('should return a list of orders', async ({ expect }) => {
      const response = await reverb.orders.getMy({});
      expect(response.data.orders).toBeDefined();
    });

    it.concurrent('should pass options to the request', async ({ expect }) => {
      const response = await reverb.orders.getMy({ page: 2 });
      expect(response.data.current_page).toEqual(2);
    });
  },
  { timeout: 60000 },
);
