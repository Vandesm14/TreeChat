import { Datastore } from '../hooks/useDB';
import { Block } from '../types';
import { Message } from './Message';

export interface ListProps {
  blocks: Block[];
  getChildren: Datastore['getChildren'];
  setExpanded: (id: Block['id'], expanded: boolean) => void;
  setRoot: (id: Block['id'] | null) => void;
  isTopLevel?: boolean;
}

export const List = ({
  blocks,
  getChildren,
  setExpanded,
  setRoot,
  isTopLevel = false,
}: ListProps) => {
  return (
    <ul
      style={{
        listStyle: 'none',
        paddingLeft: isTopLevel ? 0 : '1.8rem',
      }}
    >
      {blocks.map((block) => {
        const children = getChildren(block.id);
        return (
          <li key={block.id}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.3rem 1.3rem auto',
                gap: '0.5rem',
                height: '1.5rem',
                alignItems: 'center',
              }}
            >
              {children.length > 0 ? (
                <button onClick={() => setExpanded(block.id, !block.expanded)}>
                  {block.expanded ? '-' : '+'}
                </button>
              ) : (
                <span />
              )}
              <button onClick={() => setRoot(block.id)}>{'>'}</button>
              <Message key={block.id} block={block} />
            </div>
            {block.expanded ? (
              <List
                blocks={children}
                getChildren={getChildren}
                setExpanded={setExpanded}
                setRoot={setRoot}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
