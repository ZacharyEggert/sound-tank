import { expect, it, suite } from 'vitest';

import Reverb from '../../src/Reverb';
import { config } from 'dotenv';

config();

suite(
  'getArbitraryEndpoint',
  { timeout: 60000 },
  () => {
    const { REVERB_API_KEY } = process.env;
    const reverb = new Reverb({ apiKey: REVERB_API_KEY });

    it.concurrent(
      'should insert a slash if one is not provided',
      async ({ expect }) => {
        const response = await reverb._getArbitraryEndpoint('listings');
        const response2 = await reverb._getArbitraryEndpoint('/listings');
        expect(response.data._links).toBeDefined();
        expect(response2.data._links).toBeDefined();
      },
    );
  },
);
