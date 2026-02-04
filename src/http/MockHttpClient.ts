import { HttpClient } from './HttpClient';
import { HttpRequestConfig, HttpResponse, HttpError } from './types';

/**
 * Request matcher function type
 */
export type RequestMatcher = (url: string, config?: HttpRequestConfig) => boolean;

/**
 * Response generator function type
 */
export type ResponseGenerator<T = any> = (
  url: string,
  config?: HttpRequestConfig,
  data?: any
) => HttpResponse<T> | Promise<HttpResponse<T>>;

/**
 * Mock response configuration
 */
export interface MockResponse<T = any> {
  /**
   * Matcher to determine if this mock should be used
   */
  matcher: RequestMatcher;

  /**
   * Response to return (can be static or a function)
   */
  response: HttpResponse<T> | ResponseGenerator<T>;

  /**
   * Optional error to throw instead of returning response
   */
  error?: HttpError | Error;

  /**
   * Number of times this mock can be used (undefined = unlimited)
   */
  times?: number;
}

/**
 * Mock HTTP client for testing.
 * Allows configuring responses for specific requests without making real HTTP calls.
 */
export class MockHttpClient implements HttpClient {
  private mocks: Map<string, MockResponse[]> = new Map();
  private requests: Array<{
    method: string;
    url: string;
    config?: HttpRequestConfig;
    data?: any;
  }> = [];

  /**
   * Records a request and returns the appropriate mocked response
   */
  private async handleRequest<T>(
    method: string,
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    // Record the request
    this.requests.push({ method, url, config, data });

    // Find matching mock
    const mocks = this.mocks.get(method) || [];
    for (let i = 0; i < mocks.length; i++) {
      const mock = mocks[i];
      if (mock.matcher(url, config)) {
        // Check if this mock has uses remaining
        if (mock.times !== undefined) {
          if (mock.times <= 0) {
            continue; // Skip exhausted mocks
          }
          mock.times--;
        }

        // Throw error if configured
        if (mock.error) {
          throw mock.error;
        }

        // Return response
        if (typeof mock.response === 'function') {
          return await mock.response(url, config, data);
        }
        return mock.response as HttpResponse<T>;
      }
    }

    // No mock found - throw error
    const error: HttpError = new Error(
      `No mock found for ${method} ${url}`
    ) as HttpError;
    error.config = config;
    throw error;
  }

  async get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.handleRequest<T>('GET', url, undefined, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.handleRequest<T>('POST', url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.handleRequest<T>('PUT', url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.handleRequest<T>('DELETE', url, undefined, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.handleRequest<T>('PATCH', url, data, config);
  }

  /**
   * Configures a mock response for a specific request
   *
   * @param method - HTTP method
   * @param mock - Mock configuration
   *
   * @example
   * ```ts
   * client.onRequest('GET', {
   *   matcher: (url) => url.includes('/users'),
   *   response: { data: [{ id: 1, name: 'John' }], status: 200, statusText: 'OK', headers: {}, config: {} }
   * });
   * ```
   */
  onRequest(method: string, mock: MockResponse): void {
    if (!this.mocks.has(method)) {
      this.mocks.set(method, []);
    }
    this.mocks.get(method)!.push(mock);
  }

  /**
   * Helper to mock a GET request
   */
  onGet<T = any>(matcher: RequestMatcher, response: HttpResponse<T> | ResponseGenerator<T>): void {
    this.onRequest('GET', { matcher, response });
  }

  /**
   * Helper to mock a POST request
   */
  onPost<T = any>(matcher: RequestMatcher, response: HttpResponse<T> | ResponseGenerator<T>): void {
    this.onRequest('POST', { matcher, response });
  }

  /**
   * Helper to mock a PUT request
   */
  onPut<T = any>(matcher: RequestMatcher, response: HttpResponse<T> | ResponseGenerator<T>): void {
    this.onRequest('PUT', { matcher, response });
  }

  /**
   * Helper to mock a DELETE request
   */
  onDelete<T = any>(matcher: RequestMatcher, response: HttpResponse<T> | ResponseGenerator<T>): void {
    this.onRequest('DELETE', { matcher, response });
  }

  /**
   * Helper to mock a PATCH request
   */
  onPatch<T = any>(matcher: RequestMatcher, response: HttpResponse<T> | ResponseGenerator<T>): void {
    this.onRequest('PATCH', { matcher, response });
  }

  /**
   * Gets all recorded requests
   */
  getRequests(): Array<{
    method: string;
    url: string;
    config?: HttpRequestConfig;
    data?: any;
  }> {
    return [...this.requests];
  }

  /**
   * Gets requests for a specific method
   */
  getRequestsByMethod(method: string): Array<{
    method: string;
    url: string;
    config?: HttpRequestConfig;
    data?: any;
  }> {
    return this.requests.filter((req) => req.method === method);
  }

  /**
   * Clears all recorded requests
   */
  clearRequests(): void {
    this.requests = [];
  }

  /**
   * Clears all mocks
   */
  clearMocks(): void {
    this.mocks.clear();
  }

  /**
   * Resets the client (clears both requests and mocks)
   */
  reset(): void {
    this.clearRequests();
    this.clearMocks();
  }
}

/**
 * Helper function to create a successful HTTP response
 */
export function createMockResponse<T>(
  data: T,
  status: number = 200,
  statusText: string = 'OK'
): HttpResponse<T> {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {},
  };
}

/**
 * Helper function to create an HTTP error
 */
export function createMockError(
  message: string,
  status?: number,
  response?: HttpResponse
): HttpError {
  const error = new Error(message) as HttpError;
  error.status = status;
  error.response = response;
  error.isAxiosError = true;
  return error;
}
