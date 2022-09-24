import { Block } from './types';
import { nanoid } from 'nanoid';

export const seedBlocks = (max = 20): Block[] => {
  const blocks: Block[] = [];
  for (let i = 0; i < max; i++) {
    blocks.push({
      id: nanoid(),
      user: 'user',
      content: `Block ${i}`,
      timestamp: Date.now(),
      parent: null,
      expanded: false,
    });
  }

  // randomly assign parents
  // leave some blocks without parents
  for (let i = 0; i < max; i++) {
    const randomIndex = Math.floor(Math.random() * max);
    const randomBlock = blocks[randomIndex];
    if (randomBlock.parent === null) {
      randomBlock.parent = blocks[i].id;
    }
  }

  return blocks;
};
