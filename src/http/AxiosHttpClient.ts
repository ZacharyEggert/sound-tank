import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpClient } from './HttpClient';
import { HttpRequestConfig, HttpResponse } from './types';

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  /**
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
   * Useful for advanced axios features like interceptors.
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
