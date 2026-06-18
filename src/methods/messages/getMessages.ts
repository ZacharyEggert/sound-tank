import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl, buildUrlWithQuery } from '~/utils';
import Logger from '~/utils/logger';

export interface GetMyMessagesOptions {
  unread_only?: boolean;
}

// Get Conversations (aka "Messages") for the authenticated user
// optionally filter to only unread messages
export const getMyMessages = async (
  client: HttpClient,
  config: ReverbConfig,
  options: GetMyMessagesOptions,
): Promise<HttpResponse<any>> => {
  const { unread_only } = options;

  const url = buildUrlWithQuery(
    buildUrl(config.rootEndpoint, '/my/conversations'),
    { unread_only },
  );
  Logger.debug('Fetching my messages with URL: %s', url);

  return client.get(url, {
    headers: config.headers,
  });
};

// Get an individual Conversation (aka "Message") by its ID
export const getMessageById = async (
  client: HttpClient,
  config: ReverbConfig,
  messageId: number,
): Promise<HttpResponse<any>> => {
  const url = buildUrl(config.rootEndpoint, `/my/conversations/${messageId}`);
  Logger.debug('Fetching message with ID %d using URL: %s', messageId, url);

  return client.get(url, {
    headers: config.headers,
  });
};
