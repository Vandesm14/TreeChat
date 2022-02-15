const uuid = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export interface Block {
  id: string;
  ref: string | null;
  data: string | null;
}
export interface Pointer {
  name: string;
  ref: Block['id'] | null;
}

export type Pointers = Map<Pointer['name'], Block['id']>;
export type Blocks = Map<Block['id'], Block>;

/** An object `T` with of without the key `K` */
export type Maybe<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const Chain = (init?: { pointers?: Pointers; blocks?: Blocks }) => {
  const pointers: Pointers = new Map(init?.pointers ?? []);
  const blocks: Blocks = new Map(init?.blocks ?? []);

  // Block functions
  const add = (block: Maybe<Omit<Block, 'id'>, 'ref'>) => {
    const id = uuid();
    blocks.set(id, { ...block, id, ref: block.ref ?? null });
    return { ...block, id };
  };
  const set = (id: Block['id'], block: Partial<Block>) => {
    blocks.set(id, { ...blocks.get(id)!, ...block });
    return blocks.get(id)!;
  };
  const append = (ref: Block['id']) => {
    let next = ref;

    return (data: Block['data']) => {
      const id = uuid();
      const newBlock = { id, ref: next, data };
      blocks.set(id, newBlock);
      next = id;
      return newBlock;
    };
  };

  const get = (id: Block['id']) => blocks.get(id);
  const getTrail = (id: Block['id']) => {
    if (!blocks.has(id)) return [];
    const trail = [id];
    let current = id;
    while (true) {
      const block = get(current);
      if (!block?.ref) break;
      current = block.ref;
      if (!current) break;
      trail.unshift(current);
    }
    return trail;
  };

  /** Soft-deletes the block by setting all references to the block to `null` */
  const remove = (id: Block['id']) => {
    const target = get(id);
    const children = [...blocks.values()].filter((block) => block.ref === id);
    if (!children || !target) return;
    children.forEach((child) => {
      set(child.id, { ref: target.ref ?? null });
    });
    set(id, { ref: null });
    return target;
  };

  // Pointer functions
  const getPointer = (name: Pointer['name']) => pointers.get(name);
  const setPointer = (name: Pointer['name'], id: Block['id']) =>
    pointers.set(name, id);
  const removePointer = (name: Pointer['name']) => pointers.delete(name);

  const getBlockPointers = (id: Block['id']) =>
    [...pointers.entries()].filter(([, pointer]) => pointer === id);
  const getBlockAtPointer = (name: Pointer['name']) => {
    const pointer = getPointer(name);
    if (!pointer) return undefined;
    return get(pointer);
  };

  const addBlockAtPointer = (name: Pointer['name'], data: Block['data']) => {
    const pointer = getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const newBlock = add({ ref: pointer, data });
    setPointer(name, newBlock.id);
    return newBlock;
  };
  const removeBlockAtPointer = (name: Pointer['name']) => {
    const pointer = getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const block = remove(pointer);
    if (block?.ref) setPointer(name, block.ref);
    else removePointer(name);
    return block;
  };

  const fastForward = (name: Pointer['name'], id: Block['id']) => {
    const block = get(id);
    if (!block) throw new Error(`No such block "${id}"`);
    const pointer = getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const trail = getTrail(id);
    if (!trail.includes(id) || trail.length < 2)
      throw new Error(`Block "${id}" is not in the same chain as "${name}"`);

    setPointer(name, id);
  };

  // Other fnctions
  const getBlocks = () => blocks;
  const getPointers = () => pointers;

  const toTree = () => {
    interface Node {
      id: Block['id'];
      ref: Node[] | null;
      data: Block['data'];
      pointer?: Pointer['name'][];
      [key: string]: any;
    }

    const _format = (el: Node): Node => {
      const obj: Node = {
        id: el.id,
        data: el.data,
        pointer: [...pointers.entries()]
          .filter(([, id]) => id === el.id)
          .map(([name]) => name),
        ref: el.ref,
      };
      Object.keys(obj).forEach((key) => {
        if (!obj[key] || !obj[key]?.length) delete obj[key];
      });
      return obj;
    };

    const getChildren = (id: Block['id']) => {
      const children = [...blocks.values()].filter((block) => block.ref === id);
      return children.length ? children : null;
    };

    const addNode = (node: Block) => {
      const children = getChildren(node.id);
      if (children) {
        // @ts-expect-error
        node.ref = children.map((el) => addNode({ ...el }));
      }
      return _format(node as Node);
    };

    const tree: Node[] = [];
    const roots = [...blocks.values()].filter((block) => block.ref === null);

    roots.forEach((root) => {
      tree.push(addNode({ ...root }));
    });

    return tree;
  };

  return {
    add,
    set,
    append,
    get,
    getPointer,
    setPointer,
    removePointer,
    getBlockPointers,
    getBlockAtPointer,
    addBlockAtPointer,
    removeBlockAtPointer,
    getTrail,
    fastForward,
    remove,
    getBlocks,
    getPointers,
    toTree,
  };
};
