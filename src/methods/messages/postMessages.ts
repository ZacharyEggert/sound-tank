import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl } from '~/utils';
import Logger from '~/utils/logger';

//Mark message as read
export const markMessageAsRead = async (
  client: HttpClient,
  config: ReverbConfig,
  messageId: number,
): Promise<HttpResponse<any>> => {
  const url = buildUrl(config.rootEndpoint, `/my/conversations/${messageId}`);
  Logger.debug(
    'Marking message with ID %d as read using URL: %s',
    messageId,
    url,
  );

  const body = {
    read: true,
  };

  return client.post(url, body, {
    headers: config.headers,
  });
};

//Reply to Messages
export const replyToMessage = async (
  client: HttpClient,
  config: ReverbConfig,
  messageId: number,
  replyBody: string,
): Promise<HttpResponse<any>> => {
  const url = buildUrl(
    config.rootEndpoint,
    `/my/conversations/${messageId}/messages`,
  );
  const body = {
    body: replyBody,
  };
  Logger.debug('Replying to message with ID %d using URL: %s', messageId, url);

  return client.post(url, body, {
    headers: config.headers,
  });
};
