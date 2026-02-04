/**
 * HTTP request configuration options
 */
export interface HttpRequestConfig {
  /**
   * Request headers
   */
  headers?: Record<string, string>;

  /**
   * Query parameters
   */
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
  /**
   * Response data
   */
  data: T;

  /**
   * HTTP status code
   */
  status: number;

  /**
   * HTTP status text
   */
  statusText: string;

  /**
   * Response headers
   */
  headers: Record<string, string>;

  /**
   * The config that was provided to the request
   */
  config: HttpRequestConfig;

  /**
   * The request object (if available)
   */
  request?: any;
}

/**
 * HTTP error structure
 */
export interface HttpError extends Error {
  /**
   * The config that was provided to the request
   */
  config?: HttpRequestConfig;

  /**
   * HTTP status code (if response was received)
   */
  status?: number;

  /**
   * The response object (if available)
   */
  response?: HttpResponse;

  /**
   * Whether this is a network error
   */
  isAxiosError?: boolean;
}
