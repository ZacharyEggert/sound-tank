import { describe, expect, it } from 'vitest';
import { buildUrl } from '../../src/utils/urlBuilder';

describe('urlBuilder', () => {
  describe('buildUrl', () => {
    it('should handle path with leading slash', () => {
      const result = buildUrl('https://api.reverb.com/api', '/my/listings');
      expect(result).toBe('https://api.reverb.com/api/my/listings');
    });

    it('should handle path without leading slash', () => {
      const result = buildUrl('https://api.reverb.com/api', 'my/listings');
      expect(result).toBe('https://api.reverb.com/api/my/listings');
    });

    it('should handle baseUrl with trailing slash', () => {
      const result = buildUrl('https://api.reverb.com/api/', '/my/listings');
      expect(result).toBe('https://api.reverb.com/api/my/listings');
    });

    it('should handle baseUrl with trailing slash and path without leading slash', () => {
      const result = buildUrl('https://api.reverb.com/api/', 'my/listings');
      expect(result).toBe('https://api.reverb.com/api/my/listings');
    });

    it('should return absolute URL as-is when path is absolute HTTP', () => {
      const absoluteUrl = 'http://example.com/path';
      const result = buildUrl('https://api.reverb.com/api', absoluteUrl);
      expect(result).toBe(absoluteUrl);
    });

    it('should return absolute URL as-is when path is absolute HTTPS', () => {
      const absoluteUrl = 'https://example.com/path';
      const result = buildUrl('https://api.reverb.com/api', absoluteUrl);
      expect(result).toBe(absoluteUrl);
    });

    it('should handle root path', () => {
      const result = buildUrl('https://api.reverb.com/api', '/');
      expect(result).toBe('https://api.reverb.com/api/');
    });

    it('should handle empty path by adding slash', () => {
      const result = buildUrl('https://api.reverb.com/api', '');
      expect(result).toBe('https://api.reverb.com/api/');
    });

    it('should handle nested paths', () => {
      const result = buildUrl('https://api.reverb.com/api', '/my/orders/selling/all');
      expect(result).toBe('https://api.reverb.com/api/my/orders/selling/all');
    });

    it('should handle paths with query strings', () => {
      const result = buildUrl('https://api.reverb.com/api', '/my/listings?page=1');
      expect(result).toBe('https://api.reverb.com/api/my/listings?page=1');
    });
  });
});
