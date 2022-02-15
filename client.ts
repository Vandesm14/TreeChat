import { Chain, Pointer } from './app';

interface Message {
  user: string;
  text: string;
  isAction?: false;
}

enum ActionType {
  /** Used to initialize the main branch */
  NULL = 'NULL',
  /** Represents a branch without a message reference */
  BRANCH = 'BRANCH',
  /** A link to another message or action */
  MOVE = 'MOVE',
  /** A join event for a user */
  JOIN = 'JOIN',
  /** A leave event for a user */
  LEAVE = 'LEAVE',
  /** Represents a deleted message */
  DELETE = 'DELETE',
}

interface Action {
  type: ActionType;
  args?: Record<string, any>;
  isAction: true;
}

type Payload = Message | Action;

export class Client {
  chain: Chain<Payload>;
  channel: Pointer['name'];

  constructor(chain?: Chain<Payload>) {
    if (chain) {
      this.chain = new Chain<Payload>(chain);
      this.channel = this.chain.mainPointer;
    } else {
      this.chain = new Chain<Payload>();
      const root = this.chain.add({ data: {
        type: ActionType.NULL,
        args: {},
        isAction: true,
      }, ref: null });
      this.chain.addPointer('general', root.id);
      this.chain.setMainPointer('general');
      this.channel = 'general';
    }
    return this;
  }

  newChannel(name: string) {
    const block = this.chain.getBlockAtPointer(this.channel);
    if (!block) throw new Error('No block at current channel');
    const pointer = this.chain.addPointer(name, block.id);
    this.channel = name;
    return pointer;
  }

  newMessage(text: string) {
    try {
      const block = this.chain.addBlockAtPointer(this.channel, {
        user: 'me',
        text,
      });
      return block;
    } catch (e) {
      throw new Error('No block at current channel');
    }
  }
}
