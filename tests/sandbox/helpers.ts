import { config } from 'dotenv';
import Reverb from '../../src';

config();

export const SANDBOX_KEY = process.env.SANDBOX_REVERB_API_KEY ?? '';
export const SANDBOX_ROOT = 'https://sandbox.reverb.com/api' as const;

/**
 * Creates a Reverb client pointed at sandbox.reverb.com.
 * Requires SANDBOX_REVERB_API_KEY in .env.
 */
export function createSandboxClient(): Reverb {
  return new Reverb({
    apiKey: SANDBOX_KEY,
    rootEndpoint: SANDBOX_ROOT,
  });
}
