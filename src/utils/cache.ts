import { HttpClient, HttpRequestConfig, HttpResponse } from '~/http';

export interface ReverbCacheOptions {
  ttlMs: number;
}

export class ResponseCache {
  private entries = new Map<
    string,
    { response: HttpResponse<any>; expiresAt: number }
  >();

  constructor(private ttlMs: number) {}

  wrapClient(client: HttpClient): HttpClient {
    const self = this;
    return {
      async get<T>(
        url: string,
        config?: HttpRequestConfig,
      ): Promise<HttpResponse<T>> {
        const entry = self.entries.get(url);
        if (entry && Date.now() < entry.expiresAt) {
          return entry.response as HttpResponse<T>;
        }
        self.entries.delete(url);
        const response = await client.get<T>(url, config);
        self.entries.set(url, {
          response,
          expiresAt: Date.now() + self.ttlMs,
        });
        return response;
      },
      post: client.post.bind(client),
      put: client.put.bind(client),
      delete: client.delete.bind(client),
      patch: client.patch.bind(client),
    };
  }
}
