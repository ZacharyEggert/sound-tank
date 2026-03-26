export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
  /**
   * Additional axios-compatible config options
   */
  [key: string]: any;
}

/**
 * HTTP response structure compatible with AxiosResponse
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequestConfig;
  request?: any;
}

export interface HttpError extends Error {
  config?: HttpRequestConfig;
  /**
   * HTTP status code (if response was received)
   */
  status?: number;
  response?: HttpResponse;
  isAxiosError?: boolean;
}
