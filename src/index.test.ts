import { describe, expect, it } from 'bun:test';

import Reverb from '.';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REVERB_API_KEY: string;
      REVERB_POST_KEY: string;
    }
  }
}

describe('Index', () => {
  it('should export Reverb from the index file', () => {
    expect(Reverb).toBeDefined();
  });
});
