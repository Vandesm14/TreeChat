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
  base: Block['id'];
  tip: Block['id'];
}

export type Pointers = Map<Pointer['name'], Pointer>;
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
      const newBlock = add({ ref: next, data });
      next = newBlock.id;
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

  const getReverseTrail = (id: Block['id']) => {
    // start at the block, then see if any blocks reference it
    // these are the children of the block
    //
    // if there is more than one child, return the trail as is
    // if there is only one child, add it to the trail and continue
    // if there is no child, return the trail as is

    if (!blocks.has(id)) return [];
    const trail = [id];
    let current = id;
    while (true) {
      const block = get(current);
      if (!block) break;
      const children = [...blocks.values()].filter((b) => b.ref === block.id);
      if (children.length === 1) {
        current = children[0].id;
        trail.push(current);
      } else break;
    }
    return trail;
  };

  /** Soft-deletes the block by setting all references to the block to `null` */
  const remove = (id: Block['id']) => {
    const target = get(id);
    if (!target) return undefined;
    set(id, { ref: null });
    return target;
  };

  // Pointer functions
  const getPointer = (name: Pointer['name']) => pointers.get(name);
  const setPointer = (name: Pointer['name'], tip: Block['id']) => {
    const pointer = getPointer(name);
    pointers.set(name, { name, base: pointer?.base ?? tip, tip: tip });
    return pointer;
  };
  const removePointer = (name: Pointer['name']) => pointers.delete(name);

  const getBlockPointers = (id: Block['id']) =>
    [...pointers.entries()].filter(([, pointer]) => pointer.tip === id);
  const getBlockAtPointer = (name: Pointer['name']) => {
    const pointer = getPointer(name);
    if (!pointer) return undefined;
    return get(pointer.tip);
  };

  const addBlockAtPointer = (name: Pointer['name'], data: Block['data']) => {
    const pointer = getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const newBlock = add({ ref: pointer.tip, data });
    setPointer(name, newBlock.id);
    return newBlock;
  };
  const removeBlockAtPointer = (name: Pointer['name']) => {
    const pointer = getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const block = remove(pointer.tip);
    if (block?.ref) setPointer(name, block.ref);
    else removePointer(name);
    return block;
  };

  const fastForward = (name: Pointer['name']) => {
    const pointer = getPointer(name);
    if (!pointer) throw new Error(`No such pointer "${name}"`);
    const block = get(pointer.tip);
    if (!block) throw new Error(`No block at pointer "${name}"`);
    const trail = getReverseTrail(block.id);
    if (!trail.includes(block.id) || trail.length < 2)
      throw new Error(`Block "${block.id}" is not in the same chain as "${name}"`);

    setPointer(name, trail[trail.length - 1]);
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
    getReverseTrail,
    fastForward,
    remove,
    getBlocks,
    getPointers,
    toTree,
  };
};
