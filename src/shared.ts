import { Worker } from 'snowflake-uuid';
const snowflake = new Worker();

export interface Topic {
  name: string;
  timestamp: number;
}

export interface Message {
  id: bigint;
  userId: User['id'];
  text: string;
  children?: Message['id'][];
  topic?: Topic;
  timestamp: number;
}

export interface User {
  id: bigint;
  name: string;
}

export class Database {
  #messages: Message[];

  constructor(messages: Message[]) {
    this.#messages = messages;
  }

  getMessages(): Message[] {
    return this.#messages;
  }

  getMessage(id: Message['id']): Message | undefined {
    return this.#messages.find((message) => message.id === id);
  }

  listMessages(topicId: Message['id']): Message[] {
    const topic = this.#messages.find((message) => message.id === topicId);
    // return the children of the topic
    const messages = topic.children.map((id) =>
      this.#messages.find((message) => message.id === id)
    );
    return messages;
  }

  getChildMessages(id: Message['id']): Message[] {
    const message = this.#messages.find((message) => message.id === id);
    const messages = message.children.map((id) =>
      this.#messages.find((message) => message.id === id)
    );
    return messages;
  }

  getChildTopics(id: Message['id']): Message[] {
    const message = this.#messages.find((message) => message.id === id);
    const messages = message.children
      .map((id) => this.#messages.find((message) => message.id === id))
      .filter((message) => message.topic);

    return messages;
  }

  getTopic(topicName: string): Message | undefined {
    return this.#messages.find((message) => message.topic.name === topicName);
  }

  getTopicById(id: Message['id']): Message | undefined {
    return this.#messages.find((message) => message.id === id);
  }

  getParentTopic(id: Message['id']): Message | undefined {
    const message = this.#messages.find((message) => message.id === id);
    return message
      ? this.#messages.find((message) => message.children?.includes(id))
      : undefined;
  }

  getTopics(topicName: string): Message[] {
    return this.#messages.filter((message) => message.topic.name === topicName);
  }

  getPath(id: Message['id']): Message[] {
    const path: Message[] = [];
    let message = this.getMessage(id);
    for (let max = 100; message && max > 0; max--) {
      path.unshift(message);
      message = this.getParentTopic(message.id);
    }
    return path;
  }

  getPathString(id: Message['id']): string {
    const path = this.getPath(id);
    return path.map((message) => message.topic?.name ?? message.text ?? '').join('/');
  }
}

export function createDefaultMessages() {
  // create a list of messages with a default message called "(root)" and with one child called "#general"
  // both of these messages should be topics with the respective topic names

  const general: Message = {
    id: snowflake.nextId(),
    userId: BigInt(1),
    text: '#general',
    children: [],
    timestamp: Date.now(),
  };

  const root: Message = {
    id: snowflake.nextId(),
    userId: BigInt(1),
    text: '(root)',
    children: [general.id],
    timestamp: Date.now(),
  };

  return [root, general];
}
