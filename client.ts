import { Block, Chain, Pointer } from './app';

interface Message {
  user: string;
  text: string;
  timestamp: number;
}

enum ActionType {
  /** A null item for referencing */
  NULL = 'NULL',
  /** Represents a branch without a message reference */
  BRANCH = 'BRANCH',
  /** An embed to another message or action */
  EMBED = 'EMBED',
  /** A join event for a user */
  JOIN = 'JOIN',
  /** A leave event for a user */
  LEAVE = 'LEAVE',
  /** Represents a deleted message */
  DELETE = 'DELETE',
}

interface ActionNull {
  type: ActionType.NULL;
  timestamp: number;
}

interface ActionBranch {
  type: ActionType.BRANCH;
  branch: Pointer['name'];
  timestamp: number;
}

interface ActionEmbed {
  type: ActionType.EMBED;
  pointer?: Pointer['name'];
  message?: Block['id'];
  timestamp: number;
}

type Action = ActionNull | ActionBranch | ActionEmbed;
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
      const root = this.chain.add({
        data: {
          type: ActionType.NULL,
          timestamp: Date.now(),
        },
        ref: null,
      });
      this.chain.addPointer('general', root.id);
      this.chain.setMainPointer('general');
      this.channel = 'general';
    }
    return this;
  }

  newChannel(name: string) {
    const action = this.chain.addBlockAtPointer(this.channel, {
      type: ActionType.NULL,
      timestamp: Date.now(),
    });
    const pointer = this.chain.addPointer(name, action.id);
    this.channel = name;
    return pointer;
  }

  newReply(text: string, message: Block['id']) {
    const block = this.chain.get(message);
    if (!block) throw new Error('Message does not exist');
    const newBlock = this.chain.add({
      ref: block.id,
      data: {
        user: 'me',
        text,
        timestamp: Date.now(),
      },
    });
    this.chain.fastForward(this.channel);
    return newBlock;
  }

  newMessage(text: string) {
    try {
      const block = this.chain.addBlockAtPointer(this.channel, {
        user: 'me',
        text,
        timestamp: Date.now(),
      });
      return block;
    } catch (e) {
      throw new Error('No block at current channel');
    }
  }
}
