import { expect, it, suite } from 'vitest';

import Reverb from '../../../src/Reverb';
import { config } from 'dotenv';

config();

suite(
  'listings.getMy',
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });

    it.concurrent('should return a list of listings', async ({ expect }) => {
      const response = await reverb.listings.getMy({});
      expect(response.data.listings[0].slug).toBeDefined();
      expect(response.data.listings[0].make).toBeDefined();
      expect(response.data.listings[0].model).toBeDefined();
      expect(response.data.listings[0].description).toBeDefined();
    });

    it.concurrent(
      'should use the page option and the perPage option',
      async ({ expect }) => {
        const testNumber = Math.ceil(Math.random() * 10);
        const testNumber2 = Math.ceil(Math.random() * 10);

        const response = await reverb.listings.getMy({
          page: testNumber,
          perPage: testNumber2,
        });
        expect(response.data.current_page).toEqual(testNumber);
        expect(response.data.listings.length).toEqual(testNumber2);
      },
    );

    it.concurrent('should use all config options', async ({ expect }) => {
      const response = await reverb.listings.getMy({
        page: 5,
        perPage: 1,
        query: 'gibson',
        state: 'all',
      });

      expect(response.data.current_page).toEqual(5);
      expect(response.data.listings.length).toEqual(1);
      expect(response.data.listings[0].make).toContain('Gibson');
      expect(response.data.listings[0].state).toBeDefined();
    });
  },
  { timeout: 60000 },
);
