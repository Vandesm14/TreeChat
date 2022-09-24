export interface Block {
  id: string;
  user: string;
  content: string;
  // `null` refers to the root block (which is not a real block)
  timestamp: number;
  parent: string | null;
  expanded: boolean;
}

export type CreateBlock = Omit<Block, 'id'>;
