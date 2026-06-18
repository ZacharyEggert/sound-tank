import { expect, it, suite } from 'vitest';

import Reverb from '../../../src/Reverb';
import { config } from 'dotenv';

config();

suite('listings.getDrafts', { timeout: 60000 }, () => {
  const { REVERB_API_KEY } = process.env;
  const reverb = new Reverb({ apiKey: REVERB_API_KEY });

  it.concurrent('should return a paginated response', async ({ expect }) => {
    const response = await reverb.listings.getDrafts({});
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.listings)).toBe(true);
    expect(response.data.current_page).toBeDefined();
    expect(response.data.total).toBeDefined();
  });

  it.concurrent(
    'should respect page and perPage options',
    async ({ expect }) => {
      const response = await reverb.listings.getDrafts({ page: 1, perPage: 5 });
      expect(response.data.current_page).toBe(1);
      expect(response.data.listings.length).toBeLessThanOrEqual(5);
    },
  );
});
