import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios, { AxiosInstance } from 'axios';
import { AxiosHttpClient } from '../../src/http/AxiosHttpClient';
import { HttpClient } from '../../src/http/HttpClient';

describe('AxiosHttpClient', () => {
  describe('interface compliance', () => {
    it('should implement HttpClient interface', () => {
      const client: HttpClient = new AxiosHttpClient();

      expect(client.get).toBeDefined();
      expect(client.post).toBeDefined();
      expect(client.put).toBeDefined();
      expect(client.delete).toBeDefined();
      expect(client.patch).toBeDefined();
    });
  });

  describe('constructor', () => {
    it('should use default axios when no instance provided', () => {
      const client = new AxiosHttpClient();
      const axiosInstance = client.getAxiosInstance();

      expect(axiosInstance).toBeDefined();
    });

    it('should use provided axios instance', () => {
      const customAxios = axios.create({ baseURL: 'https://custom.api' });
      const client = new AxiosHttpClient(customAxios);

      expect(client.getAxiosInstance()).toBe(customAxios);
    });
  });

  describe('HTTP methods', () => {
    let mockAxios: AxiosInstance;
    let client: AxiosHttpClient;

    beforeEach(() => {
      mockAxios = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      } as any;

      client = new AxiosHttpClient(mockAxios);
    });

    describe('get', () => {
      it('should call axios.get and return converted response', async () => {
        const mockResponse = {
          data: { id: 1, name: 'Test' },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {},
          request: {},
        };

        vi.mocked(mockAxios.get).mockResolvedValue(mockResponse);

        const response = await client.get('/api/test', {
          headers: { Authorization: 'Bearer token' },
        });

        expect(mockAxios.get).toHaveBeenCalledWith('/api/test', {
          headers: { Authorization: 'Bearer token' },
        });
        expect(response).toEqual({
          data: { id: 1, name: 'Test' },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {},
          request: {},
        });
      });
    });

    describe('post', () => {
      it('should call axios.post and return converted response', async () => {
        const mockResponse = {
          data: { id: 2, name: 'Created' },
          status: 201,
          statusText: 'Created',
          headers: { 'content-type': 'application/json' },
          config: {},
          request: {},
        };

        const postData = { name: 'New Item' };
        vi.mocked(mockAxios.post).mockResolvedValue(mockResponse);

        const response = await client.post('/api/test', postData, {
          headers: { Authorization: 'Bearer token' },
        });

        expect(mockAxios.post).toHaveBeenCalledWith('/api/test', postData, {
          headers: { Authorization: 'Bearer token' },
        });
        expect(response.status).toBe(201);
        expect(response.data).toEqual({ id: 2, name: 'Created' });
      });
    });

    describe('put', () => {
      it('should call axios.put and return converted response', async () => {
        const mockResponse = {
          data: { id: 1, name: 'Updated' },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {},
          request: {},
        };

        const putData = { name: 'Updated Item' };
        vi.mocked(mockAxios.put).mockResolvedValue(mockResponse);

        const response = await client.put('/api/test/1', putData);

        expect(mockAxios.put).toHaveBeenCalledWith('/api/test/1', putData, undefined);
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ id: 1, name: 'Updated' });
      });
    });

    describe('delete', () => {
      it('should call axios.delete and return converted response', async () => {
        const mockResponse = {
          data: {},
          status: 204,
          statusText: 'No Content',
          headers: {},
          config: {},
          request: {},
        };

        vi.mocked(mockAxios.delete).mockResolvedValue(mockResponse);

        const response = await client.delete('/api/test/1');

        expect(mockAxios.delete).toHaveBeenCalledWith('/api/test/1', undefined);
        expect(response.status).toBe(204);
      });
    });

    describe('patch', () => {
      it('should call axios.patch and return converted response', async () => {
        const mockResponse = {
          data: { id: 1, email: 'updated@example.com' },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {},
          request: {},
        };

        const patchData = { email: 'updated@example.com' };
        vi.mocked(mockAxios.patch).mockResolvedValue(mockResponse);

        const response = await client.patch('/api/test/1', patchData);

        expect(mockAxios.patch).toHaveBeenCalledWith('/api/test/1', patchData, undefined);
        expect(response.status).toBe(200);
        expect(response.data.email).toBe('updated@example.com');
      });
    });
  });

  describe('response conversion', () => {
    it('should preserve all axios response properties', async () => {
      const mockAxios = {
        get: vi.fn().mockResolvedValue({
          data: { test: 'data' },
          status: 200,
          statusText: 'OK',
          headers: { 'x-custom': 'header' },
          config: { url: '/test' },
          request: { method: 'GET' },
        }),
      } as any;

      const client = new AxiosHttpClient(mockAxios);
      const response = await client.get('/test');

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('statusText');
      expect(response).toHaveProperty('headers');
      expect(response).toHaveProperty('config');
      expect(response).toHaveProperty('request');
    });
  });
});
