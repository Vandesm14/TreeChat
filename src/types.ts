export interface Block {
  id: string;
  user: string;
  content: string;
  // `null` refers to the root block (which is not a real block)
  timestamp: number;
  parent: string | null;
  expanded: boolean;
  pinned: boolean;
}

export type CreateBlock = Pick<Block, 'user' | 'content'> & Partial<Block>;
