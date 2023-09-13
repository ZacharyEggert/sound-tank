import { describe, expect, it } from 'bun:test';

import Reverb from '../Reverb';
import { config } from 'dotenv';
import { getMyRoot } from '.';

config();

describe('getMyRoot', () => {
  const { REVERB_API_KEY } = process.env;
  const reverb = new Reverb({ apiKey: REVERB_API_KEY });

  // it('should fetch a valid response', async ({ expect }) => {
  //   const response = await getMyRoot(reverb);
  //   //expect a 200 response code
  //   expect(response.status).toBeLessThan(300);
  // });

  it('should fetch a response with a _links object', async () => {
    const response = await getMyRoot<{ _links: Record<string, any> }>(reverb);
    //expect the response to have a Links object
    expect(response.data._links).toBeDefined();
  });
});
