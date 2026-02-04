/**
 * Builds a URL-encoded query string from an object of parameters.
 * Filters out undefined and null values.
 *
 * @param params - An object containing query parameters
 * @returns A query string (without leading "?") or empty string if no valid params
 *
 * @example
 * ```ts
 * buildQueryString({ page: 1, per_page: 50 })
 * // Returns: "page=1&per_page=50"
 *
 * buildQueryString({ query: "guitar", state: undefined })
 * // Returns: "query=guitar"
 *
 * buildQueryString({ search: "hello world" })
 * // Returns: "search=hello%20world"
 *
 * buildQueryString({})
 * // Returns: ""
 * ```
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return entries.join('&');
}

/**
 * Builds a complete URL with query parameters.
 *
 * @param baseUrl - The base URL
 * @param params - An object containing query parameters
 * @returns The complete URL with query string
 *
 * @example
 * ```ts
 * buildUrlWithQuery("https://api.reverb.com/api/my/listings", { page: 1 })
 * // Returns: "https://api.reverb.com/api/my/listings?page=1"
 *
 * buildUrlWithQuery("https://api.reverb.com/api/my/listings", {})
 * // Returns: "https://api.reverb.com/api/my/listings"
 * ```
 */
export function buildUrlWithQuery(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const queryString = buildQueryString(params);
  if (!queryString) {
    return baseUrl;
  }
  return `${baseUrl}?${queryString}`;
}
