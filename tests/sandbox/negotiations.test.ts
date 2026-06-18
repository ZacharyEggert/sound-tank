import { beforeAll, describe, expect, it } from 'vitest';
import Reverb from '../../src';
import { SANDBOX_KEY, createSandboxClient } from './helpers';

describe.skipIf(!SANDBOX_KEY)('Sandbox: Negotiations', () => {
  let reverb: Reverb;

  beforeAll(() => {
    reverb = createSandboxClient();
  });

  it('should fetch active negotiations', async () => {
    const response = await reverb.negotiations.getNegotiations({
      status: 'active',
      page: 1,
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.listings)).toBe(true);
  });

  it('should fetch all negotiations', async () => {
    const response = await reverb.negotiations.getNegotiations({
      status: 'all',
      page: 1,
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  });

  it('should fetch a single negotiation by offer id', async () => {
    const page = await reverb.negotiations.getNegotiations({
      status: 'all',
      page: 1,
    });

    const firstNegotiation = page.data.listings?.[0]?.negotiations?.[0];

    if (!firstNegotiation) {
      console.warn(
        'No negotiations found in sandbox — skipping getNegotiation assertion',
      );
      return;
    }

    const response = await reverb.negotiations.getNegotiation(
      String(firstNegotiation.id),
    );

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(firstNegotiation.id);
  });
});
