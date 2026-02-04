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
  // Check if path is an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Ensure baseUrl doesn't end with a slash and path starts with one
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
