import { HttpClient } from './HttpClient';
import { HttpRequestConfig, HttpResponse } from './types';
import Logger from '~/utils/logger';

export class FetchHttpClient implements HttpClient {
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const { headers, params, timeout } = config ?? {};

    let fullUrl = url;
    if (params) {
      const query = Object.entries(params)
        .filter(([, v]) => v != null)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join('&');
      if (query) fullUrl += (url.includes('?') ? '&' : '?') + query;
    }

    let controller: AbortController | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (timeout) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller!.abort(), timeout);
    }

    try {
      const resolvedHeaders = headers
        ? (Object.fromEntries(
            Object.entries(headers).filter(([, v]) => v !== undefined),
          ) as Record<string, string>)
        : undefined;

      const init: RequestInit = {
        method,
        headers: resolvedHeaders,
        signal: controller?.signal,
      };
      if (data !== undefined) {
        init.body = typeof data === 'string' ? data : JSON.stringify(data);
      }

      const res = await fetch(fullUrl, init);

      if (timeoutId) clearTimeout(timeoutId);

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const contentType = res.headers.get('content-type') ?? '';
      const responseData: T = contentType.includes('json')
        ? await res.json()
        : ((await res.text()) as unknown as T);

      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}: ${res.statusText}`) as any;
        err.status = res.status;
        err.response = {
          data: responseData,
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
          config: config ?? {},
        };
        throw err;
      }

      return {
        data: responseData,
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        config: config ?? {},
      };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      throw err;
    }
  }

  async get<T = any>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    Logger.trace('GET request to %s with config: %o', url, config);
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    Logger.trace(
      'POST request to %s with data: %o and config: %o',
      url,
      data,
      config,
    );
    return this.request<T>('POST', url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    Logger.trace(
      'PUT request to %s with data: %o and config: %o',
      url,
      data,
      config,
    );
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    Logger.trace('DELETE request to %s with config: %o', url, config);
    return this.request<T>('DELETE', url, undefined, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    Logger.trace(
      'PATCH request to %s with data: %o and config: %o',
      url,
      data,
      config,
    );
    return this.request<T>('PATCH', url, data, config);
  }
}
