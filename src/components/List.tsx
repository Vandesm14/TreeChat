import { Datastore } from '../hooks/useDB';
import { Block } from '../types';
import { Message } from './Message';

export interface ListProps {
  blocks: Block[];
  getChildren: Datastore['getChildren'];
  setExpanded: (id: Block['id'], expanded: boolean) => void;
}

export const List = ({ blocks, getChildren, setExpanded }: ListProps) => {
  return (
    <ul>
      {blocks.map((block) => {
        const children = getChildren(block.id);
        return (
          <div>
            <div
              style={{
                display: 'flex',
              }}
            >
              {children.length > 0 && (
                <button onClick={() => setExpanded(block.id, !block.expanded)}>
                  {block.expanded ? '-' : '+'}
                </button>
              )}
              <Message key={block.id} block={block} />
            </div>
            {block.expanded && (
              <List
                key={block.id}
                blocks={children}
                getChildren={getChildren}
                setExpanded={setExpanded}
              />
            )}
          </div>
        );
      })}
    </ul>
  );
};
