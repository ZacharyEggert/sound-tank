import { HttpRequestConfig, HttpResponse } from './types';

/**
 * Abstract HTTP client interface for making API requests.
 * This abstraction allows for different implementations (e.g., axios, fetch, mock)
 * while keeping the business logic decoupled from the HTTP layer.
 */
export interface HttpClient {
  /**
   * Performs an HTTP GET request
   *
   * @param url - The URL to request
   * @param config - Optional request configuration
   * @returns Promise resolving to the HTTP response
   *
   * @example
   * ```ts
   * const response = await client.get<User>('/api/users/123', {
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * console.log(response.data);
   * ```
   */
  get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Performs an HTTP POST request
   *
   * @param url - The URL to request
   * @param data - The request body data
   * @param config - Optional request configuration
   * @returns Promise resolving to the HTTP response
   *
   * @example
   * ```ts
   * const response = await client.post<User>('/api/users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * }, {
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Performs an HTTP PUT request
   *
   * @param url - The URL to request
   * @param data - The request body data
   * @param config - Optional request configuration
   * @returns Promise resolving to the HTTP response
   *
   * @example
   * ```ts
   * const response = await client.put<User>('/api/users/123', {
   *   name: 'Jane Doe'
   * }, {
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Performs an HTTP DELETE request
   *
   * @param url - The URL to request
   * @param config - Optional request configuration
   * @returns Promise resolving to the HTTP response
   *
   * @example
   * ```ts
   * const response = await client.delete('/api/users/123', {
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Performs an HTTP PATCH request
   *
   * @param url - The URL to request
   * @param data - The request body data
   * @param config - Optional request configuration
   * @returns Promise resolving to the HTTP response
   *
   * @example
   * ```ts
   * const response = await client.patch<User>('/api/users/123', {
   *   email: 'newemail@example.com'
   * }, {
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
}
