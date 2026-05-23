import { beforeAll, describe, expect, it } from 'vitest';
import Reverb from '../../src';
import { SANDBOX_KEY, createSandboxClient } from './helpers';

describe.skipIf(!SANDBOX_KEY)('Sandbox: Orders', () => {
  let reverb: Reverb;

  beforeAll(() => {
    reverb = createSandboxClient();
  });

  it('should fetch my selling orders', async () => {
    const response = await reverb.orders.getMy({ page: 1 });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.orders)).toBe(true);
  });
});
