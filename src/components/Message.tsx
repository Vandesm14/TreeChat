import { Block } from '../types';

export interface MessageProps {
  block: Block;
}

export const Message = ({ block }: MessageProps) => {
  return <div>{block.content}</div>;
};
