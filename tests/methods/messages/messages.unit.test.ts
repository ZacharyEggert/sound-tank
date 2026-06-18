import { describe, expect, it, beforeEach } from 'vitest';
import {
  getMyMessages,
  getMessageById,
} from '../../../src/methods/messages/getMessages';
import {
  markMessageAsRead,
  replyToMessage,
} from '../../../src/methods/messages/postMessages';
import { MockHttpClient, createMockResponse } from '~/http/MockHttpClient';
import { ReverbConfig } from '~/config/ReverbConfig';

describe('messages (unit tests with MockHttpClient)', () => {
  let mockClient: MockHttpClient;
  let config: ReverbConfig;

  const mockConversation = {
    id: 1,
    subject: 'Question about your listing',
    body: 'Is this still available?',
    read: false,
    created_at: '2026-06-01T12:00:00Z',
  };

  beforeEach(() => {
    mockClient = new MockHttpClient();
    config = {
      rootEndpoint: 'https://api.reverb.com/api',
      apiKey: 'test-api-key',
      headers: {
        'Content-Type': 'application/hal+json',
        'Accept-Version': '3.0',
        Accept: 'application/hal+json',
        'Accept-Language': 'en',
        'X-Display-Currency': 'USD',
        Authorization: 'Bearer test-api-key',
      },
      version: '3.0',
      locale: 'en',
      displayCurrency: 'USD',
    };
  });

  describe('getMyMessages', () => {
    it('should fetch conversations', async () => {
      const mockResponse = { conversations: [mockConversation], total: 1 };
      mockClient.onGet(
        (url) => url.includes('/my/conversations'),
        createMockResponse(mockResponse),
      );

      const response = await getMyMessages(mockClient, config, {});

      expect(response.status).toBe(200);
      expect(response.data.conversations).toHaveLength(1);
      expect(response.data.conversations[0].id).toBe(1);

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/conversations');
    });

    it('should include unread_only param when true', async () => {
      mockClient.onGet(
        (url) => url.includes('unread_only=true'),
        createMockResponse({ conversations: [], total: 0 }),
      );

      await getMyMessages(mockClient, config, { unread_only: true });

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain('unread_only=true');
    });

    it('should omit unread_only param when not set', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/conversations'),
        createMockResponse({ conversations: [], total: 0 }),
      );

      await getMyMessages(mockClient, config, {});

      const requests = mockClient.getRequests();
      expect(requests[0].url).not.toContain('unread_only');
    });

    it('should send correct headers', async () => {
      mockClient.onGet(
        (_url, reqConfig) =>
          reqConfig?.headers?.Authorization === 'Bearer test-api-key' &&
          reqConfig?.headers?.['Accept-Version'] === '3.0',
        createMockResponse({ conversations: [], total: 0 }),
      );

      await getMyMessages(mockClient, config, {});

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });
  });

  describe('getMessageById', () => {
    it('should fetch a single conversation by id', async () => {
      mockClient.onGet(
        (url) => url.includes('/my/conversations/1'),
        createMockResponse(mockConversation),
      );

      const response = await getMessageById(mockClient, config, 1);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(1);
      expect(response.data.subject).toBe('Question about your listing');

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/conversations/1');
    });

    it('should use the messageId in the URL', async () => {
      const otherId = 42;
      mockClient.onGet(
        (url) => url.includes(`/my/conversations/${otherId}`),
        createMockResponse({ ...mockConversation, id: otherId }),
      );

      await getMessageById(mockClient, config, otherId);

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain(`/my/conversations/${otherId}`);
    });

    it('should send correct headers', async () => {
      mockClient.onGet(
        (_url, reqConfig) =>
          reqConfig?.headers?.Authorization === 'Bearer test-api-key',
        createMockResponse(mockConversation),
      );

      await getMessageById(mockClient, config, 1);

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });
  });

  describe('markMessageAsRead', () => {
    it('should POST to the conversation URL with read:true', async () => {
      mockClient.onPost(
        (url) => url.includes('/my/conversations/1'),
        createMockResponse({ ...mockConversation, read: true }),
      );

      const response = await markMessageAsRead(mockClient, config, 1);

      expect(response.status).toBe(200);
      expect(response.data.read).toBe(true);

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/conversations/1');
      expect(requests[0].data).toEqual({ read: true });
    });

    it('should use the messageId in the URL', async () => {
      const otherId = 99;
      mockClient.onPost(
        (url) => url.includes(`/my/conversations/${otherId}`),
        createMockResponse({ read: true }),
      );

      await markMessageAsRead(mockClient, config, otherId);

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain(`/my/conversations/${otherId}`);
    });

    it('should send correct headers', async () => {
      mockClient.onPost(
        (_url, reqConfig) =>
          reqConfig?.headers?.Authorization === 'Bearer test-api-key',
        createMockResponse({ read: true }),
      );

      await markMessageAsRead(mockClient, config, 1);

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });
  });

  describe('replyToMessage', () => {
    it('should POST a reply to the conversation messages endpoint', async () => {
      const replyText = 'Yes, still available!';
      mockClient.onPost(
        (url) => url.includes('/my/conversations/1/messages'),
        createMockResponse({ body: replyText }),
      );

      const response = await replyToMessage(mockClient, config, 1, replyText);

      expect(response.status).toBe(200);

      const requests = mockClient.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toContain('/my/conversations/1/messages');
      expect(requests[0].data).toEqual({ body: replyText });
    });

    it('should use the messageId in the URL', async () => {
      const otherId = 7;
      mockClient.onPost(
        (url) => url.includes(`/my/conversations/${otherId}/messages`),
        createMockResponse({}),
      );

      await replyToMessage(mockClient, config, otherId, 'hello');

      const requests = mockClient.getRequests();
      expect(requests[0].url).toContain(
        `/my/conversations/${otherId}/messages`,
      );
    });

    it('should send the reply body in the request', async () => {
      const replyText = 'Shipping to Canada is $25';
      mockClient.onPost(
        (url) => url.includes('/my/conversations/5/messages'),
        createMockResponse({}),
      );

      await replyToMessage(mockClient, config, 5, replyText);

      const requests = mockClient.getRequests();
      expect(requests[0].data).toEqual({ body: replyText });
    });

    it('should send correct headers', async () => {
      mockClient.onPost(
        (_url, reqConfig) =>
          reqConfig?.headers?.Authorization === 'Bearer test-api-key',
        createMockResponse({}),
      );

      await replyToMessage(mockClient, config, 1, 'hi');

      const requests = mockClient.getRequests();
      expect(requests[0].config?.headers?.Authorization).toBe(
        'Bearer test-api-key',
      );
    });
  });
});
