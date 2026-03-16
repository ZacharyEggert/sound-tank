import Logger from "./logger";

/**
 * Builds a complete URL from a base URL and path, handling both absolute and relative URLs.
 *
 * @param baseUrl - The base URL (e.g., "https://api.reverb.com/api")
 * @param path - The path to append (e.g., "/my/listings" or "my/listings")
 * @returns The complete URL
 *
 * @example
 * ```ts
 * buildUrl("https://api.reverb.com/api", "/my/listings")
 * // Returns: "https://api.reverb.com/api/my/listings"
 *
 * buildUrl("https://api.reverb.com/api", "my/listings")
 * // Returns: "https://api.reverb.com/api/my/listings"
 *
 * buildUrl("https://api.reverb.com/api", "https://example.com/absolute")
 * // Returns: "https://example.com/absolute"
 * ```
 */
export function buildUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
		Logger.debug('Provided path is an absolute URL: %s', path);
    return path;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const fullUrl = `${normalizedBase}${normalizedPath}`;
	Logger.debug('Built URL: %s from base: %s and path: %s', fullUrl, baseUrl, path);
  return fullUrl;
}
