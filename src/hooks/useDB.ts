import React from 'react';
import { nanoid } from 'nanoid';
import { Block, CreateBlock } from '../types';

export interface Datastore {
  add: (block: CreateBlock, parent?: Block['id']) => Datastore;
  get: (id: Block['id']) => Block | undefined;
  update: (block: Block) => Datastore;
  delete: (id: Block['id']) => Datastore;

  has: (id: Block['id']) => boolean;

  getChildren: (id: Block['parent']) => Block[];
  getRootBlocks: () => Block[];
  getAll: () => Block[];
  getPath: (id: Block['id']) => Block[];

  map: (fn: (block: Block) => Block) => void;

  blocks: Block[];
}

const createDb = (
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
): Datastore => ({
  has: (id) => blocks.some((b) => b.id === id),

  add: (block) => {
    const newBlock: Block = {
      id: nanoid(),
      expanded: false,
      pinned: false,
      parent: null,
      timestamp: Date.now(),
      ...block,
    };

    setBlocks([...blocks, newBlock]);
    return createDb([...blocks, newBlock], setBlocks);
  },
  get: (id) => blocks.find((b) => b.id === id),
  update: (block) => {
    const index = blocks.findIndex((b) => b.id === block.id);

    if (index > -1) {
      const newBlocks = blocks.map((b, i) => (i === index ? block : b));
      setBlocks(newBlocks);
    }

    return createDb(blocks, setBlocks);
  },
  delete: (id) => {
    const index = blocks.findIndex((b) => b.id === id);

    if (index > -1) {
      const newBlocks = blocks.filter((b) => b.id !== id);
      setBlocks(newBlocks);
    }

    return createDb(blocks, setBlocks);
  },

  getChildren: (id) => blocks.filter((b) => b.parent === id),
  getRootBlocks: () => blocks.filter((b) => b.parent === null),
  getAll: () => blocks,
  getPath: (id) => {
    // recursively get the path to the root block
    const getParents = (id: Block['id']): Block[] => {
      const block = blocks.find((b) => b.id === id);
      if (!block) return [];
      if (block.parent === null) return [block];
      return [block, ...getParents(block.parent)];
    };

    return getParents(id).reverse();
  },

  map: (fn) => {
    const newBlocks = blocks.map(fn);
    setBlocks(newBlocks);
  },

  blocks,
});

export const useDB = (init?: Block[]): Datastore => {
  const [blocks, setBlocks] = React.useState<Block[]>(init || []);

  return createDb(blocks, setBlocks);
};
