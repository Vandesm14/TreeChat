import { IGunChain, IGunInstance } from 'gun/types';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export type MessageSchema = {
  /** The ID of the message */
  id: string;

  /** The text content of the message */
  text: string;

  /** The timestamp of the message */
  epoch: number;
};
export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  epoch: z.number(),
});

export const MessageNode = z.object({
  _: z.any(),
  ...MessageSchema.shape,
});
export type MessageNode = z.infer<typeof MessageNode>;

export const byEpoch = (a: MessageSchema, b: MessageSchema) =>
  a.epoch - b.epoch;

export function createMessage(
  gun: IGunInstance,
  path: MessageSchema['id'][],
  text: string
) {
  const message = {
    id: nanoid(),
    text,
    epoch: Date.now(),
  };
  traverse(gun, [...path, message.id]).put(message);

  return message;
}

export function traverse(
  gun: IGunInstance,
  path: MessageSchema['id'][]
): IGunChain<
  any,
  IGunChain<any, IGunInstance<any>, IGunInstance<any>, 'messages'>,
  IGunInstance<any>,
  string
> {
  // let messages: IGunChain<Message & GunSchema> = gun.get('messages');
  let messages: any = gun.get('messages');

  for (let part of path) {
    messages = messages.get(part);
  }
  return messages;
}
