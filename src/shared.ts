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

export class User {
  id: bigint;
  #messages: Message[];

  constructor(id: User['id']) {
    this.id = id;
    this.#messages = this.#messages.filter((message) => message.userId === id);
  }

  messages(): Message[] {
    return this.#messages;
  }
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

  getUser(userId: User['id']): User | undefined {
    const user = this.#messages.find((message) => message.userId === userId);
    return user ? new User(userId) : undefined;
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
