import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  getMyMessages,
  getMessageById,
  GetMyMessagesOptions,
} from '~/methods/messages/getMessages';
import {
  markMessageAsRead,
  replyToMessage,
} from '~/methods/messages/postMessages';

export class MessagesResource {
  constructor(
    private getClient: () => HttpClient,
    private getConfig: () => ReverbConfig,
  ) {}

  getMy(options: GetMyMessagesOptions = {}) {
    return getMyMessages(this.getClient(), this.getConfig(), options);
  }

  getById(messageId: number) {
    return getMessageById(this.getClient(), this.getConfig(), messageId);
  }

  markAsRead(messageId: number) {
    return markMessageAsRead(this.getClient(), this.getConfig(), messageId);
  }

  reply(messageId: number, replyBody: string) {
    return replyToMessage(
      this.getClient(),
      this.getConfig(),
      messageId,
      replyBody,
    );
  }
}
