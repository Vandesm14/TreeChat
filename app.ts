const uuid = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export interface Block<D = string> {
  id: string;
  ref: string | null;
  data: D | null;
}
export interface Pointer {
  name: string;
  base: Block['id'];
  tip: Block['id'];
}

export type Pointers = Map<Pointer['name'], Pointer>;
export type Blocks<D = string> = Map<Block['id'], Block<D>>;

/** An object `T` with of without the key `K` */
export type Maybe<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export class Chain<D = string> {
  pointers: Pointers;
  blocks: Blocks<D>;

  // TODO: Do we need to support a main pointer?
  mainPointer: Pointer['name'];

  constructor(init?: {
    pointers?: Pointers;
    blocks?: Blocks<D>;
    mainPointer?: Pointer['name'];
  }) {
    this.pointers = new Map(init?.pointers ?? []);
    this.blocks = new Map(init?.blocks ?? []);
    this.mainPointer = init?.mainPointer ?? 'main';
    return this;
  }

  // Block functions
  add(block: Maybe<Omit<Block<D>, 'id'>, 'ref'>) {
    const id = uuid();
    this.blocks.set(id, { ...block, id, ref: block.ref ?? null });
    return { ...block, id };
  }
  set(id: Block['id'], block: Partial<Block<D>>) {
    this.blocks.set(id, { ...this.blocks.get(id)!, ...block });
    return this.blocks.get(id)!;
  }
  append(ref: Block['id']) {
    let next = ref;

    return (data: D) => {
      const newBlock = this.add({ ref: next, data });
      next = newBlock.id;
      return newBlock;
    };
  }

  get(id: Block['id']) {
    return this.blocks.get(id);
  }

  /** Soft-deletes the block by setting all references to the block to `null` */
  remove(id: Block['id']) {
    const target = this.get(id);
    if (!target) return undefined;
    this.set(id, { ref: null });
    return target;
  }

  getTrail(id: Block['id']) {
    if (!this.blocks.has(id)) return [];
    const trail = [id];
    let current = id;
    while (true) {
      const block = this.get(current);
      if (!block?.ref) break;
      current = block.ref;
      if (!current) break;
      trail.unshift(current);
    }
    return trail;
  }
  getReverseTrail(id: Block['id']) {
    if (!this.blocks.has(id)) return [];
    const trail = [id];
    let current = id;
    while (true) {
      const block = this.get(current);
      if (!block) break;
      const children = [...this.blocks.values()].filter(
        (b) => b.ref === block.id
      );
      if (children.length === 1) {
        current = children[0].id;
        trail.push(current);
      } else break;
    }
    return trail;
  }

  // Pointer functions
  getPointer(name: Pointer['name']) {
    return this.pointers.get(name);
  }
  setPointer(name: Pointer['name'], tip: Block['id']) {
    const pointer = this.getPointer(name);
    this.pointers.set(name, { name, base: pointer?.base ?? tip, tip: tip });
    return pointer;
  }
  addPointer(name: Pointer['name'], base: Block['id'], tip?: Block['id']) {
    if (this.pointers.has(name))
      throw new Error(`Pointer "${name}" already exists`);
    this.pointers.set(name, { name, base, tip: tip ?? base });
    return this.getPointer(name);
  }
  removePointer(name: Pointer['name']) {
    return this.pointers.delete(name);
  }

  // TODO: Do we need to support a main pointer?
  getMainPointer() {
    return this.getPointer(this.mainPointer);
  }
  setMainPointer(name: Pointer['name']) {
    if (!this.pointers.has(name)) throw new Error(`No such pointer "${name}"`);
    this.mainPointer = name;
    return this.getPointer(name);
  }

  getBlockPointers(id: Block['id']) {
    return [...this.pointers.entries()].filter(
      ([, pointer]) => pointer.tip === id
    );
  }
  getBlockAtPointer(name: Pointer['name']) {
    const pointer = this.getPointer(name);
    if (!pointer) return undefined;
    return this.get(pointer.tip);
  }

  addBlockAtPointer(name: Pointer['name'], data: D) {
    const pointer = this.getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const newBlock = this.add({ ref: pointer.tip, data });
    this.setPointer(name, newBlock.id);
    return newBlock;
  }
  removeBlockAtPointer(name: Pointer['name']) {
    const pointer = this.getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const block = this.remove(pointer.tip);
    if (block?.ref) this.setPointer(name, block.ref);
    else this.removePointer(name);
    return block;
  }

  fastForward(name: Pointer['name']) {
    const pointer = this.getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const block = this.get(pointer.tip);
    if (!block) throw new Error(`No block at pointer "${name}"`);
    const trail = this.getReverseTrail(block.id);
    if (!trail.includes(block.id) || trail.length < 2)
      throw new Error(
        `Block "${block.id}" is not in the same chain as "${name}"`
      );

    this.setPointer(name, trail[trail.length - 1]);
  }

  // Other fnctions
  getBlocks() {
    return [...this.blocks].map(([, block]) => block);
  }
  getPointers() {
    return [...this.pointers].map(([, pointer]) => pointer);
  }

  toTree(rootId?: Block['id']) {
    interface Node {
      id: Block['id'];
      ref: Node[] | null;
      data: D;
      pointer?: Pointer['name'][];
      [key: string]: any;
    }

    const _format = (el: Node): Node => {
      const obj: Node = {
        id: el.id,
        data: el.data,
        pointer: [...this.pointers.entries()]
          .filter(([, id]) => id.tip === el.id)
          .map(([name]) => name),
        ref: el.ref,
      };
      Object.keys(obj).forEach((key) => {
        if (!obj[key] || !obj[key]?.length) delete obj[key];
      });
      return obj;
    };
    const getChildren = (id: Block['id']) => {
      const children = [...this.blocks.values()].filter(
        (block) => block.ref === id
      );
      return children.length ? children : null;
    };
    const addNode = (node: Block<D>) => {
      const children = getChildren(node.id);
      if (children) {
        // @ts-expect-error
        node.ref = children.map((el) => addNode({ ...el }));
      }
      return _format(node as Node);
    };

    const tree: Node[] = [];
    const roots =
      rootId && this.get(rootId)
        ? [this.get(rootId)!]
        : [...this.blocks.values()].filter((block) => block.ref === null);

    roots.forEach((root) => {
      tree.push(addNode({ ...root }));
    });

    return tree;
  }
  toJSON = () => {
    return this.toTree();
  };
}
