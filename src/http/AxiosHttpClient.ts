import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpClient } from './HttpClient';
import { HttpRequestConfig, HttpResponse } from './types';

/**
 * Production HTTP client implementation using axios.
 * Wraps axios to implement the HttpClient interface while preserving
 * all axios functionality and response structure.
 */
export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  /**
   * Creates a new AxiosHttpClient instance
   *
   * @param axiosInstance - Optional custom axios instance. If not provided, uses the default axios instance.
   *
   * @example
   * ```ts
   * // Using default axios
   * const client = new AxiosHttpClient();
   *
   * // Using custom axios instance
   * const customAxios = axios.create({ baseURL: 'https://api.example.com' });
   * const client = new AxiosHttpClient(customAxios);
   * ```
   */
  constructor(axiosInstance?: AxiosInstance) {
    this.axiosInstance = axiosInstance || axios;
  }

  /**
   * Converts an AxiosResponse to HttpResponse.
   * In practice, they're compatible, but this ensures type safety.
   */
  private convertResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      config: response.config as HttpRequestConfig,
      request: response.request,
    };
  }

  async get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config);
    return this.convertResponse(response);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return this.convertResponse(response);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return this.convertResponse(response);
  }

  async delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return this.convertResponse(response);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return this.convertResponse(response);
  }

  /**
   * Gets the underlying axios instance.
   * Useful for advanced axios features like interceptors.
   *
   * @returns The axios instance
   *
   * @example
   * ```ts
   * const client = new AxiosHttpClient();
   * const axios = client.getAxiosInstance();
   * axios.interceptors.request.use(config => {
   *   console.log('Request:', config);
   *   return config;
   * });
   * ```
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
