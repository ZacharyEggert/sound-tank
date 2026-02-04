import { describe, expect, it, beforeEach } from 'vitest';
import {
  MockHttpClient,
  createMockResponse,
  createMockError,
} from '../../src/http/MockHttpClient';
import { HttpClient } from '../../src/http/HttpClient';

describe('MockHttpClient', () => {
  let client: MockHttpClient;

  beforeEach(() => {
    client = new MockHttpClient();
  });

  describe('interface compliance', () => {
    it('should implement HttpClient interface', () => {
      const httpClient: HttpClient = client;

      expect(httpClient.get).toBeDefined();
      expect(httpClient.post).toBeDefined();
      expect(httpClient.put).toBeDefined();
      expect(httpClient.delete).toBeDefined();
      expect(httpClient.patch).toBeDefined();
    });
  });

  describe('GET requests', () => {
    it('should return mocked response for matching GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      client.onGet(
        (url) => url === '/api/test',
        createMockResponse(mockData)
      );

      const response = await client.get('/api/test');

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('should throw error when no mock matches', async () => {
      await expect(client.get('/api/unknown')).rejects.toThrow(
        'No mock found for GET /api/unknown'
      );
    });

    it('should use response generator function', async () => {
      client.onGet(
        (url) => url.startsWith('/api/users/'),
        (url) => {
          const id = url.split('/').pop();
          return createMockResponse({ id, name: `User ${id}` });
        }
      );

      const response = await client.get('/api/users/123');

      expect(response.data).toEqual({ id: '123', name: 'User 123' });
    });
  });

  describe('POST requests', () => {
    it('should return mocked response for matching POST request', async () => {
      const mockData = { id: 2, name: 'Created' };
      client.onPost(
        (url) => url === '/api/test',
        createMockResponse(mockData, 201, 'Created')
      );

      const response = await client.post('/api/test', { name: 'New Item' });

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(201);
    });

    it('should pass data to response generator', async () => {
      client.onPost(
        (url) => url === '/api/users',
        (url, config, data) => {
          return createMockResponse({ ...data, id: 999 }, 201);
        }
      );

      const response = await client.post('/api/users', { name: 'John' });

      expect(response.data).toEqual({ name: 'John', id: 999 });
    });
  });

  describe('PUT requests', () => {
    it('should return mocked response for matching PUT request', async () => {
      const mockData = { id: 1, name: 'Updated' };
      client.onPut((url) => url === '/api/test/1', createMockResponse(mockData));

      const response = await client.put('/api/test/1', { name: 'Updated' });

      expect(response.data).toEqual(mockData);
    });
  });

  describe('DELETE requests', () => {
    it('should return mocked response for matching DELETE request', async () => {
      client.onDelete(
        (url) => url === '/api/test/1',
        createMockResponse({}, 204, 'No Content')
      );

      const response = await client.delete('/api/test/1');

      expect(response.status).toBe(204);
    });
  });

  describe('PATCH requests', () => {
    it('should return mocked response for matching PATCH request', async () => {
      const mockData = { id: 1, email: 'updated@example.com' };
      client.onPatch(
        (url) => url === '/api/test/1',
        createMockResponse(mockData)
      );

      const response = await client.patch('/api/test/1', {
        email: 'updated@example.com',
      });

      expect(response.data).toEqual(mockData);
    });
  });

  describe('request recording', () => {
    it('should record all requests', async () => {
      client.onGet((url) => url === '/api/test', createMockResponse({}));
      client.onPost((url) => url === '/api/test', createMockResponse({}));

      await client.get('/api/test');
      await client.post('/api/test', { data: 'test' });

      const requests = client.getRequests();
      expect(requests).toHaveLength(2);
      expect(requests[0]).toMatchObject({
        method: 'GET',
        url: '/api/test',
      });
      expect(requests[1]).toMatchObject({
        method: 'POST',
        url: '/api/test',
        data: { data: 'test' },
      });
    });

    it('should filter requests by method', async () => {
      client.onGet((url) => true, createMockResponse({}));
      client.onPost((url) => true, createMockResponse({}));

      await client.get('/api/test1');
      await client.post('/api/test2', {});
      await client.get('/api/test3');

      const getRequests = client.getRequestsByMethod('GET');
      expect(getRequests).toHaveLength(2);
      expect(getRequests[0].url).toBe('/api/test1');
      expect(getRequests[1].url).toBe('/api/test3');
    });

    it('should clear requests', async () => {
      client.onGet((url) => true, createMockResponse({}));

      await client.get('/api/test');
      expect(client.getRequests()).toHaveLength(1);

      client.clearRequests();
      expect(client.getRequests()).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should throw configured error', async () => {
      const error = createMockError('Not Found', 404);
      client.onRequest('GET', {
        matcher: (url) => url === '/api/test',
        response: createMockResponse({}),
        error,
      });

      await expect(client.get('/api/test')).rejects.toThrow('Not Found');
    });

    it('should include error details', async () => {
      const errorResponse = createMockResponse({ message: 'Error' }, 500);
      const error = createMockError('Server Error', 500, errorResponse);
      client.onRequest('GET', {
        matcher: (url) => url === '/api/test',
        response: createMockResponse({}),
        error,
      });

      try {
        await client.get('/api/test');
        expect.fail('Should have thrown error');
      } catch (e: any) {
        expect(e.status).toBe(500);
        expect(e.response).toEqual(errorResponse);
      }
    });
  });

  describe('mock management', () => {
    it('should clear all mocks', async () => {
      client.onGet((url) => true, createMockResponse({}));

      await client.get('/api/test');
      expect(client.getRequests()).toHaveLength(1);

      client.clearMocks();

      await expect(client.get('/api/test')).rejects.toThrow(
        'No mock found for GET /api/test'
      );
    });

    it('should reset client (clear requests and mocks)', async () => {
      client.onGet((url) => true, createMockResponse({}));
      await client.get('/api/test');

      expect(client.getRequests()).toHaveLength(1);

      client.reset();

      expect(client.getRequests()).toHaveLength(0);
      await expect(client.get('/api/test')).rejects.toThrow();
    });
  });

  describe('limited use mocks', () => {
    it('should respect times limit', async () => {
      client.onRequest('GET', {
        matcher: (url) => url === '/api/test',
        response: createMockResponse({ count: 1 }),
        times: 2,
      });

      // First two calls should succeed
      await client.get('/api/test');
      await client.get('/api/test');

      // Third call should fail
      await expect(client.get('/api/test')).rejects.toThrow(
        'No mock found for GET /api/test'
      );
    });

    it('should allow unlimited uses when times is undefined', async () => {
      client.onGet((url) => url === '/api/test', createMockResponse({}));

      // Should work indefinitely
      await client.get('/api/test');
      await client.get('/api/test');
      await client.get('/api/test');

      expect(client.getRequests()).toHaveLength(3);
    });
  });

  describe('matcher flexibility', () => {
    it('should match based on URL pattern', async () => {
      client.onGet(
        (url) => url.startsWith('/api/users/'),
        createMockResponse({ user: 'data' })
      );

      const response = await client.get('/api/users/123');
      expect(response.data).toEqual({ user: 'data' });
    });

    it('should match based on config', async () => {
      client.onGet(
        (url, config) => config?.headers?.Authorization === 'Bearer token',
        createMockResponse({ authenticated: true })
      );

      const response = await client.get('/api/test', {
        headers: { Authorization: 'Bearer token' },
      });

      expect(response.data).toEqual({ authenticated: true });
    });

    it('should use first matching mock', async () => {
      client.onGet((url) => true, createMockResponse({ id: 1 }));
      client.onGet((url) => true, createMockResponse({ id: 2 }));

      const response = await client.get('/api/test');
      expect(response.data.id).toBe(1);
    });
  });

  describe('helper functions', () => {
    describe('createMockResponse', () => {
      it('should create response with defaults', () => {
        const response = createMockResponse({ data: 'test' });

        expect(response).toEqual({
          data: { data: 'test' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });
      });

      it('should create response with custom status', () => {
        const response = createMockResponse({ data: 'test' }, 201, 'Created');

        expect(response.status).toBe(201);
        expect(response.statusText).toBe('Created');
      });
    });

    describe('createMockError', () => {
      it('should create error with message', () => {
        const error = createMockError('Test error');

        expect(error.message).toBe('Test error');
        expect(error.isAxiosError).toBe(true);
      });

      it('should create error with status and response', () => {
        const response = createMockResponse({ error: 'details' }, 404);
        const error = createMockError('Not found', 404, response);

        expect(error.status).toBe(404);
        expect(error.response).toEqual(response);
      });
    });
  });
});
