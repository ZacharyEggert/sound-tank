import { expect, it, suite } from 'vitest';
import Reverb from '../../../src/Reverb';
import { config } from 'dotenv';

config();

suite('catalog', { timeout: 30000 }, () => {
  const { REVERB_API_KEY } = process.env;
  const reverb = new Reverb({ apiKey: REVERB_API_KEY });

  it.concurrent('getCategories() should return non-empty array', async () => {
    const response = await reverb.catalog.getCategories();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0]).toHaveProperty('uuid');
    expect(response.data[0]).toHaveProperty('full_name');
  });

  it.concurrent('getConditions() should return non-empty array', async () => {
    const response = await reverb.catalog.getConditions();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0]).toHaveProperty('uuid');
    expect(response.data[0]).toHaveProperty('display_name');
  });

  it.concurrent(
    'getShippingRegions() should return non-empty array',
    async () => {
      const response = await reverb.catalog.getShippingRegions();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]).toHaveProperty('name');
      expect(response.data[0]).toHaveProperty('code');
    },
  );

  it.concurrent('getCurrencies() should return non-empty array', async () => {
    const response = await reverb.catalog.getCurrencies();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(typeof response.data[0]).toBe('string');
    expect(response.data[0].length).toBeGreaterThan(0);
  });
});
