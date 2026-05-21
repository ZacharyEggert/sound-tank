import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { FetchHttpClient } from '../../src/http/FetchHttpClient';
import { HttpClient } from '../../src/http/HttpClient';

const makeResponse = (body: any, status = 200, statusText = 'OK', contentType = 'application/json') => {
  const headers = new Headers({ 'content-type': contentType });
  return new Response(JSON.stringify(body), { status, statusText, headers });
};

describe('FetchHttpClient', () => {
  let client: FetchHttpClient;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    client = new FetchHttpClient();
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('implements HttpClient', () => {
    const c: HttpClient = client;
    expect(c.get).toBeDefined();
    expect(c.post).toBeDefined();
    expect(c.put).toBeDefined();
    expect(c.delete).toBeDefined();
    expect(c.patch).toBeDefined();
  });

  describe('get', () => {
    it('calls fetch with GET and returns parsed response', async () => {
      fetchSpy.mockResolvedValue(makeResponse({ id: 1 }));

      const response = await client.get('https://api.example.com/test', {
        headers: { Authorization: 'Bearer token' },
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({ method: 'GET' }),
      );
      expect(response.data).toEqual({ id: 1 });
      expect(response.status).toBe(200);
    });
  });

  describe('post', () => {
    it('calls fetch with POST and serializes body', async () => {
      fetchSpy.mockResolvedValue(makeResponse({ id: 2 }, 201, 'Created'));

      const response = await client.post('https://api.example.com/test', { name: 'item' });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'item' }) }),
      );
      expect(response.status).toBe(201);
    });
  });

  describe('put', () => {
    it('calls fetch with PUT', async () => {
      fetchSpy.mockResolvedValue(makeResponse({ id: 1 }));
      await client.put('https://api.example.com/test/1', { name: 'updated' });
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });

  describe('delete', () => {
    it('calls fetch with DELETE', async () => {
      fetchSpy.mockResolvedValue(makeResponse({}, 200, 'OK'));
      const response = await client.delete('https://api.example.com/test/1');
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'DELETE' }),
      );
      expect(response.status).toBe(200);
    });
  });

  describe('patch', () => {
    it('calls fetch with PATCH', async () => {
      fetchSpy.mockResolvedValue(makeResponse({ email: 'new@example.com' }));
      const response = await client.patch('https://api.example.com/test/1', { email: 'new@example.com' });
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'PATCH' }),
      );
      expect(response.data).toEqual({ email: 'new@example.com' });
    });
  });

  describe('params', () => {
    it('appends query params to URL', async () => {
      fetchSpy.mockResolvedValue(makeResponse([]));
      await client.get('https://api.example.com/items', { params: { page: 1, per_page: 50 } });
      const calledUrl = fetchSpy.mock.calls[0][0] as string;
      expect(calledUrl).toContain('page=1');
      expect(calledUrl).toContain('per_page=50');
    });

    it('omits null/undefined params', async () => {
      fetchSpy.mockResolvedValue(makeResponse([]));
      await client.get('https://api.example.com/items', { params: { page: 1, query: undefined } });
      const calledUrl = fetchSpy.mock.calls[0][0] as string;
      expect(calledUrl).not.toContain('query');
    });
  });

  describe('error handling', () => {
    it('throws on non-ok response', async () => {
      fetchSpy.mockResolvedValue(makeResponse({ error: 'not found' }, 404, 'Not Found'));
      await expect(client.get('https://api.example.com/missing')).rejects.toMatchObject({
        status: 404,
      });
    });

    it('filters undefined header values', async () => {
      fetchSpy.mockResolvedValue(makeResponse({}));
      await client.get('https://api.example.com/test', {
        headers: { Authorization: 'Bearer x', 'X-Optional': undefined },
      });
      const init = fetchSpy.mock.calls[0][1] as RequestInit;
      expect((init.headers as Record<string, string>)['X-Optional']).toBeUndefined();
      expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer x');
    });
  });
});
