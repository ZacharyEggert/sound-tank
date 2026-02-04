import { describe, expect, it } from 'vitest';
import { buildQueryString, buildUrlWithQuery } from './queryBuilder';

describe('queryBuilder', () => {
  describe('buildQueryString', () => {
    it('should build query string from object with string values', () => {
      const result = buildQueryString({ page: '1', query: 'guitar' });
      expect(result).toBe('page=1&query=guitar');
    });

    it('should build query string from object with number values', () => {
      const result = buildQueryString({ page: 1, per_page: 50 });
      expect(result).toBe('page=1&per_page=50');
    });

    it('should build query string from object with boolean values', () => {
      const result = buildQueryString({ active: true, draft: false });
      expect(result).toBe('active=true&draft=false');
    });

    it('should filter out undefined values', () => {
      const result = buildQueryString({ page: 1, query: undefined, state: 'live' });
      expect(result).toBe('page=1&state=live');
    });

    it('should filter out null values', () => {
      const result = buildQueryString({ page: 1, query: null, state: 'live' });
      expect(result).toBe('page=1&state=live');
    });

    it('should return empty string for empty object', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });

    it('should return empty string when all values are undefined or null', () => {
      const result = buildQueryString({ page: undefined, query: null });
      expect(result).toBe('');
    });

    it('should URL-encode special characters', () => {
      const result = buildQueryString({ search: 'hello world', tag: 'rock&roll' });
      expect(result).toBe('search=hello%20world&tag=rock%26roll');
    });

    it('should handle values with equals sign', () => {
      const result = buildQueryString({ formula: 'x=y+z' });
      expect(result).toBe('formula=x%3Dy%2Bz');
    });

    it('should handle mixed value types', () => {
      const result = buildQueryString({
        page: 1,
        query: 'test',
        active: true,
        skip: undefined
      });
      expect(result).toBe('page=1&query=test&active=true');
    });

    it('should handle single parameter', () => {
      const result = buildQueryString({ page: 1 });
      expect(result).toBe('page=1');
    });

    it('should preserve zero as valid value', () => {
      const result = buildQueryString({ page: 0, offset: 0 });
      expect(result).toBe('page=0&offset=0');
    });

    it('should preserve empty string as valid value', () => {
      const result = buildQueryString({ query: '', page: 1 });
      expect(result).toBe('query=&page=1');
    });

    it('should preserve false as valid value', () => {
      const result = buildQueryString({ draft: false, page: 1 });
      expect(result).toBe('draft=false&page=1');
    });
  });

  describe('buildUrlWithQuery', () => {
    it('should append query string to URL', () => {
      const result = buildUrlWithQuery('https://api.reverb.com/api/my/listings', {
        page: 1,
        per_page: 50
      });
      expect(result).toBe('https://api.reverb.com/api/my/listings?page=1&per_page=50');
    });

    it('should return URL without query string when params are empty', () => {
      const result = buildUrlWithQuery('https://api.reverb.com/api/my/listings', {});
      expect(result).toBe('https://api.reverb.com/api/my/listings');
    });

    it('should return URL without query string when all params are undefined', () => {
      const result = buildUrlWithQuery('https://api.reverb.com/api/my/listings', {
        page: undefined,
        query: null
      });
      expect(result).toBe('https://api.reverb.com/api/my/listings');
    });

    it('should handle URL with existing query string', () => {
      const result = buildUrlWithQuery('https://api.reverb.com/api/my/listings?existing=value', {
        page: 1
      });
      expect(result).toBe('https://api.reverb.com/api/my/listings?existing=value?page=1');
    });

    it('should URL-encode parameter values', () => {
      const result = buildUrlWithQuery('https://api.reverb.com/api/my/listings', {
        search: 'hello world'
      });
      expect(result).toBe('https://api.reverb.com/api/my/listings?search=hello%20world');
    });
  });
});
