import { Block } from '../types';

export interface PathProps {
  path: Block[];
  setRoot: (id: Block['id'] | null) => void;
}

export const Path = ({ path, setRoot }: PathProps) => {
  return (
    <div>
      <button onClick={() => setRoot(null)}>Root</button>
      {path.length > 0 ? <span>/</span> : null}
      {path.map((block, i) => (
        <>
          <button key={block.id} onClick={() => setRoot(block.id)}>
            {block.content}
          </button>
          {i < path.length - 1 ? <span>/</span> : null}
        </>
      ))}
    </div>
  );
};
