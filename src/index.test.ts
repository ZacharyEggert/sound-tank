import { describe, expect, it } from 'vitest';

import Reverb from '.';

describe('Index', () => {
  it('should export Reverb from the index file', () => {
    expect(Reverb).toBeDefined();
  });
});
