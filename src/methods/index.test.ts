import { expect, it, suite } from 'vitest';

import Reverb from '../Reverb';
import { config } from 'dotenv';
import { getMyRoot } from '.';

config();

suite(
  'getMyRoot',
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });

    // it('should fetch a valid response', async ({ expect }) => {
    //   const response = await getMyRoot(reverb);
    //   //expect a 200 response code
    //   expect(response.status).toBeLessThan(300);
    // });

    it.concurrent(
      'should fetch a response with a _links object',
      async ({ expect }) => {
        const response = await getMyRoot<{ _links: Record<string, any> }>(
          reverb,
        );
        //expect the response to have a Links object
        expect(response.data._links).toBeDefined();
      },
    );
  },
  { timeout: 60000 },
);

suite(
  'getArbitraryEndpoint',
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });

    it.concurrent(
      'should insert a slash if one is not provided',
      async ({ expect }) => {
        const response = await reverb.getArbitraryEndpoint({ url: 'listings' });
        const response2 = await reverb.getArbitraryEndpoint({
          url: '/listings',
        });
        expect(response.data._links).toBeDefined();
        expect(response2.data._links).toBeDefined();
      },
    );
  },
  { timeout: 60000 },
);
