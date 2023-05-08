import { expect, it, suite } from 'vitest';

import Reverb from '../../Reverb';
import { config } from 'dotenv';
import { getMyListings } from '.';

config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REVERB_API_KEY: string;
    }
  }
}

suite(
  'getMyListings',
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });
    it.concurrent('should return a list of listings', async ({ expect }) => {
      const response = await getMyListings<{ listings: any[] }>(reverb, {});
      expect(response.data.listings.length).toBeDefined();
    });
    it.concurrent('should use the page option', async ({ expect }) => {
      const response = await getMyListings<{ listings: any }>(reverb, {
        page: 2,
      });
      expect(response.data.listings.length).toBeDefined();
    });
  },
  { timeout: 30000 },
);
