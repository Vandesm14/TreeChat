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

  blocks: Block[];
}

const createDb = (
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
): Datastore => ({
  has: (id) => blocks.some((b) => b.id === id),

  add: (block, parent) => {
    const newBlock: Block = {
      ...block,
      id: nanoid(),
      parent: parent || null,
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

  blocks,
});

export const useDB = (init?: Block[]): Datastore => {
  const [blocks, setBlocks] = React.useState<Block[]>(init || []);

  return createDb(blocks, setBlocks);
};
