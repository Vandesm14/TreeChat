import { Block } from '../types';

export interface MessageProps {
  block: Block;
  style?: React.CSSProperties;
}

const timestampAsTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

export const Message = ({ block, style }: MessageProps) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        ...style,
      }}
    >
      <i>{timestampAsTime(block.timestamp)}</i>
      <b>{block.user}</b>
      <span>{block.content}</span>
    </div>
  );
};
