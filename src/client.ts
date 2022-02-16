import { Graph, Node, GraphView } from "./graph";
// FIXME: use snowflakes instead, this is just temporary
import { v4 } from "uuid";

export type Key = ReturnType<typeof v4>;

export enum PayloadKind {
  /** An empty payload. */
  Null = "NULL",
  /** Create a new branch. */
  Branch = "BRANCH",
  /** Got a new message. */
  Message = "MESSAGE",

  // /** An embed to another message or action. */
  // Embed = "EMBED",
  // /** A join event for a user. */
  // Join = "JOIN",
  // /** A leave event for a user. */
  // Leave = "LEAVE",
  // /** Represents a deleted message. */
  // Delete = "DELETE",
}

export type Payload = ({
  type: PayloadKind.Null;
} | {
  type: PayloadKind.Branch;
  key: Key;
} | {
  type: PayloadKind.Message,
  user: string;
  body: string;
}) & { timestamp: Date; };

export class Client {
  #graph: Graph<Key, Payload>;
  #root: { key: Key, node: Node<Key, Payload> };

  constructor() {
    this.#graph = new Graph();
    this.#root = { key: v4(), node: new Node({ type: PayloadKind.Branch, timestamp: new Date() }) };

    if (!this.#graph.create(this.#root.key, this.#root.node))
      throw Error("unable to create root node in graph");
  }
}

////////////////////////////////////////////////////////////////////////////////

// import { Block, Graph, Pointer } from './graph';

// interface Message {
//   user: string;
//   text: string;
//   timestamp: number;
// }

// enum ActionType {
//   /** A null item for referencing */
//   NULL = 'NULL',
//   /** Represents a branch without a message reference */
//   BRANCH = 'BRANCH',
//   /** An embed to another message or action */
//   EMBED = 'EMBED',
//   /** A join event for a user */
//   JOIN = 'JOIN',
//   /** A leave event for a user */
//   LEAVE = 'LEAVE',
//   /** Represents a deleted message */
//   DELETE = 'DELETE',
// }

// interface ActionNull {
//   type: ActionType.NULL;
//   timestamp: number;
// }

// interface ActionBranch {
//   type: ActionType.BRANCH;
//   branch: Pointer['name'];
//   timestamp: number;
// }

// interface ActionEmbed {
//   type: ActionType.EMBED;
//   pointer?: Pointer['name'];
//   message?: Block['id'];
//   timestamp: number;
// }

// type Action = ActionNull | ActionBranch | ActionEmbed;
// type Payload = Message | Action;

// export class Client {
//   chain: Graph<Payload>;
//   channel: Pointer['name'];

//   constructor(chain?: Graph<Payload>) {
//     if (chain) {
//       this.chain = new Graph<Payload>(chain);
//       this.channel = this.chain.mainPointer;
//     } else {
//       this.chain = new Graph<Payload>();
//       const root = this.chain.add({
//         data: {
//           type: ActionType.NULL,
//           timestamp: Date.now(),
//         },
//         ref: null,
//       });
//       this.chain.addPointer('general', root.id);
//       this.chain.setMainPointer('general');
//       this.channel = 'general';
//     }
//     return this;
//   }

//   newChannel(name: string): Pointer {
//     const action = this.chain.addBlockAtPointer(this.channel, {
//       type: ActionType.NULL,
//       timestamp: Date.now(),
//     });
//     const pointer = this.chain.addPointer(name, action.id);
//     this.channel = name;
//     return pointer;
//   }

//   newReply(text: string, message: Block['id']): Block<Payload> {
//     const block = this.chain.get(message);
//     if (!block) throw new Error('Message does not exist');
//     const newBlock = this.chain.add({
//       ref: block.id,
//       data: {
//         user: 'me',
//         text,
//         timestamp: Date.now(),
//       },
//     });
//     if (!newBlock) throw new Error('Failed to add new block');
//     this.chain.fastForward(this.channel);
//     return newBlock;
//   }

//   newMessage(text: string): Block<Payload> {
//     try {
//       const block = this.chain.addBlockAtPointer(this.channel, {
//         user: 'me',
//         text,
//         timestamp: Date.now(),
//       });
//       return block;
//     } catch (e) {
//       throw new Error('No block at current channel');
//     }
//   }
// }
