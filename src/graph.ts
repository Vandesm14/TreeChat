// import { v4 as uuid } from 'uuid';

/** A node in the `Graph`. */
export class Node<K, V> {
  /** The value of this node. */
  value: V;
  /** The parent of this node. */
  parent?: K;

  constructor(value: V, parent?: K) {
    this.value = value;
    this.parent = parent;
  }
}

// NOTE: for ease of use? (at some point)
// export type KeyNode<K, V> = Node<K, V> & { key: K };

/** Contains a collection of `Node`s. */
export class Graph<K, V> {
  #nodes: Map<K, Node<K, V>>;

  constructor() {
    this.#nodes = new Map();
  }

  // nodes(): Map<K, Node<K, V>> {
  //   return this.#nodes;
  // }

  /**
   * Creates a new `Node` without overriding any existing `Node`.
   *
   * Returns whether the `Node` was successfully created.
   */
  create(key: K, node: Node<K, V>): boolean {
    if (this.#nodes.has(key)) return false;
    this.#nodes.set(key, node);
    return true;
  }

  /**
   * Inserts a new `Node` while overriding any existing `Node`.
   *
   * Returns the previous `Node` if one existed or `undefined`.
   */
  insert(key: K, node: Node<K, V>): Node<K, V> | undefined {
    const old = this.#nodes.get(key);
    this.#nodes.set(key, node);
    return old;
  }

  /** Queries and returns a `Node` if it exists or `undefined`. */
  get(key: K): Node<K, V> | undefined {
    return this.#nodes.get(key);
  }

  /** Queries and returns whether a `Node` exists. */
  has(key: K): boolean {
    return this.#nodes.has(key);
  }
}

/** Handles viewing a `Graph` easier. */
// TODO: i don't know what to call this, shane you can do it
export class GraphView<K, V> {
  #graph: Graph<K, V>;

  constructor(graph: Graph<K, V>) {
    this.#graph = graph;
  }

  /** Returns the parent `Node` of a child `Node`, if any. */
  parent(key: K | Node<K, V>): Node<K, V> | undefined {
    if (!(key instanceof Node)) {
      const child = this.#graph.get(key);
      if (child === undefined) return;
      key = child;
    }
    if (key.parent == undefined) return;
    return this.#graph.get(key.parent);
  }

  /** Returns an iterator up the tree through the node's parents. */
  // FIXME: this should actually implement `IterableIterator`
  from(key: K): Iterator<Node<K, V>, undefined> {
    const parent = this.parent.bind(this);
    let current = this.#graph.get(key);

    return {
      next() {
        if (current === undefined) return { done: true };
        const tmp = current;
        current = parent(current);
        return { value: tmp };
      },
    };
  }
}

////////////////////////////////////////////////////////////////////////////////

// export interface Block<D = string> {
//   id: string;
//   ref: string | null;
//   data: D | null;
// }
// export interface Pointer {
//   name: string;
//   base: Block['id'];
//   tip: Block['id'];
// }

// export type Pointers = Map<Pointer['name'], Pointer>;
// export type Blocks<D = string> = Map<Block['id'], Block<D>>;

// /** An object `T` with of without the key `K` */
// export type Maybe<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// export class Graph<D = string> {
//   pointers: Pointers;
//   blocks: Blocks<D>;

//   // TODO: Do we need to support a main pointer?
//   mainPointer: Pointer['name'];

//   constructor(init?: {
//     pointers?: Pointers;
//     blocks?: Blocks<D>;
//     mainPointer?: Pointer['name'];
//   }) {
//     this.pointers = new Map(init?.pointers ?? []);
//     this.blocks = new Map(init?.blocks ?? []);
//     this.mainPointer = init?.mainPointer ?? 'main';
//   }

//   // Block functions
//   add(block: Omit<Block<D>, 'id'>): Block<D> {
//     const id = uuid();
//     const newblock = { ...block, id, ref: block.ref };
//     this.blocks.set(id, newblock);
//     return newblock;
//   }
//   set(id: Block['id'], block: Partial<Block<D>>): Block<D> {
//     this.blocks.set(id, { ...this.blocks.get(id)!, ...block });
//     return this.blocks.get(id)!;
//   }
//   append(ref: Block['id']): (data: D) => Block<D> {
//     let next = ref;

//     return (data: D) => {
//       const newBlock = this.add({ ref: next, data });
//       next = newBlock.id;
//       return newBlock;
//     };
//   }

//   get(id: Block['id']): Block<D> | undefined {
//     return this.blocks.get(id);
//   }
//   has(id: Block['id']): boolean {
//     return this.blocks.has(id);
//   }

//   /** Soft-deletes the block by setting all references to the block to `null` */
//   remove(id: Block['id']): Block<D> | undefined {
//     const target = this.get(id);
//     if (!target) return undefined;
//     this.set(id, { ref: null });
//     return target;
//   }

//   getTrail(id: Block['id']): Block['id'][] {
//     if (!this.has(id)) return [];
//     const trail = [id];
//     let current = id;
//     while (true) {
//       const block = this.get(current);
//       if (!block?.ref) break;
//       current = block.ref;
//       trail.unshift(current);
//     }
//     return trail;
//   }
//   getReverseTrail(id: Block['id']): Block['id'][] {
//     if (!this.has(id)) return [];
//     const trail = [id];
//     let current = id;
//     while (true) {
//       const block = this.get(current);
//       if (!block) break;
//       const children = [...this.blocks.values()].filter(
//         (b) => b.ref === block.id
//       );
//       if (children.length === 1) {
//         current = children[0].id;
//         trail.push(current);
//       } else break;
//     }
//     return trail;
//   }

//   // Pointer functions
//   getPointer(name: Pointer['name']): Pointer | undefined {
//     return this.pointers.get(name);
//   }
//   setPointer(
//     name: Pointer['name'],
//     tip: Block['id'],
//     base?: Block['id']
//   ): Pointer {
//     const pointer = this.getPointer(name);
//     if (!pointer) throw new Error(`No such pointer "${name}"`);
//     this.pointers.set(name, { name, base: base ?? pointer?.base ?? tip, tip });
//     return pointer;
//   }
//   addPointer(
//     name: Pointer['name'],
//     base: Block['id'],
//     tip?: Block['id']
//   ): Pointer {
//     if (this.pointers.has(name))
//       throw new Error(`Pointer "${name}" already exists`);
//     this.pointers.set(name, { name, base, tip: tip ?? base });
//     return this.getPointer(name)!;
//   }
//   removePointer(name: Pointer['name']): Pointer | undefined {
//     const pointer = this.getPointer(name);
//     if (!pointer) return undefined;
//     this.pointers.delete(name);
//     return pointer;
//   }

//   // TODO: Do we need to support a main pointer?
//   getMainPointer(): Pointer | undefined {
//     return this.getPointer(this.mainPointer);
//   }
//   setMainPointer(name: Pointer['name']): Pointer {
//     if (!this.pointers.has(name)) throw new Error(`No such pointer "${name}"`);
//     this.mainPointer = name;
//     return this.getPointer(name)!;
//   }

//   getBlockPointers(id: Block['id']): Pointer[] {
//     return [...this.pointers.values()].filter(
//       // @ts-expect-error
//       ([, pointer]) => pointer.tip === id
//     );
//   }
//   getBlockAtPointer(name: Pointer['name']): Block<D> | undefined {
//     const pointer = this.getPointer(name);
//     if (!pointer) return undefined;
//     return this.get(pointer.tip);
//   }

//   addBlockAtPointer(name: Pointer['name'], data: D): Block<D> {
//     const pointer = this.getPointer(name);
//     if (!pointer) throw new Error(`No such pointer "${name}"`);
//     const newBlock = this.add({ ref: pointer.tip, data });
//     this.setPointer(name, newBlock.id);
//     return newBlock;
//   }
//   removeBlockAtPointer(name: Pointer['name']): Block<D> | undefined {
//     const pointer = this.getPointer(name);
//     if (!pointer) throw new Error(`No such pointer "${name}"`);
//     const block = this.remove(pointer.tip);
//     if (block?.ref) this.setPointer(name, block.ref);
//     else this.removePointer(name);
//     return block;
//   }

//   fastForward(name: Pointer['name']): Pointer {
//     const pointer = this.getPointer(name);
//     if (!pointer) throw new Error(`No such pointer "${name}"`);
//     const block = this.get(pointer.tip);
//     if (!block) throw new Error(`No block at pointer "${name}"`);
//     const trail = this.getReverseTrail(block.id);
//     if (!trail.includes(block.id) || trail.length < 2)
//       throw new Error(
//         `Block "${block.id}" is not in the same chain as "${name}"`
//       );

//     return this.setPointer(name, trail[trail.length - 1]);
//   }

//   // Other fnctions
//   getBlocks(): Block<D>[] {
//     return [...this.blocks].map(([, block]) => block);
//   }
//   getPointers(): Pointer[] {
//     return [...this.pointers].map(([, pointer]) => pointer);
//   }

//   toTree(rootId?: Block['id']) {
//     interface TreeNode {
//       id: Block['id'];
//       ref: TreeNode[] | null;
//       data: D;
//       pointer?: Pointer['name'][];
//       [key: string]: any;
//     }

//     const _format = (el: TreeNode): TreeNode => {
//       const obj: TreeNode = {
//         id: el.id,
//         data: el.data,
//         pointer: [...this.pointers.entries()]
//           .filter(([, id]) => id.tip === el.id)
//           .map(([name]) => name),
//         ref: el.ref,
//       };
//       Object.keys(obj).forEach((key) => {
//         if (!obj[key] || !obj[key]?.length) delete obj[key];
//       });
//       return obj;
//     };
//     const getChildren = (id: Block['id']) => {
//       const children = [...this.blocks.values()].filter(
//         (block) => block.ref === id
//       );
//       return children.length ? children : null;
//     };
//     const addNode = (node: Block<D>) => {
//       const children = getChildren(node.id);
//       if (children) {
//         // @ts-expect-error
//         node.ref = children.map((el) => addNode({ ...el }));
//       }
//       return _format(node as TreeNode);
//     };

//     const tree: TreeNode[] = [];
//     const roots =
//       rootId && this.get(rootId)
//         ? [this.get(rootId)!]
//         : [...this.blocks.values()].filter((block) => block.ref === null);

//     roots.forEach((root) => {
//       tree.push(addNode({ ...root }));
//     });

//     return tree;
//   }
//   toJSON = () => {
//     return this.toTree();
//   };
// }
