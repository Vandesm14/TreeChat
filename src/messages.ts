import { IGunInstance } from 'gun/types';

export type Message = {
  /** The ID of the message */
  id: string;

  /** The text content of the message */
  text: string;

  /** The timestamp of the message */
  epoch: number;
};

export type MessageWInfo = Message & {
  /** If a message has replies */
  hasReplies: boolean;
};

export const byEpoch = (a: Message, b: Message) => a.epoch - b.epoch;

export function createMessage(
  gun: IGunInstance,
  parent: Message['id'],
  message: Message
) {
  gun.get('messages').get(parent).get(message.id).put(message);
}

export function listMessages(gun: IGunInstance, parent?: Message['id']) {
  const messages: Message[] = [];
  const messageQuery = parent
    ? gun.get('messages').get(parent)
    : gun.get('messages');
  messageQuery.map().once((message) => {
    messages.push(message);
  });
  return messages.sort(byEpoch);
}
