import React from 'react';
import { createRoot } from 'react-dom/client';
import { List } from './components/List';
import { seedBlocks } from './db';
import { useDB } from './hooks/useDB';
import { Block } from './types';
import { Path } from './components/Path';
import { ChatBox } from './components/ChatBox';
import { Column, Row } from './components/compose/flex';

const App = () => {
  const db = useDB(seedBlocks());
  const [root, setRoot] = React.useState<Block['parent']>(null);

  const setExpanded = (id: Block['id'], expanded: boolean) => {
    if (db.has(id)) {
      db.update({ ...db.get(id)!, expanded });
    }
  };

  const expandAll = () => db.map((block) => ({ ...block, expanded: true }));
  const collapseAll = () => db.map((block) => ({ ...block, expanded: false }));

  return (
    <Column>
      <h1>Blocks</h1>
      <Row>
        <button onClick={expandAll}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button>
      </Row>
      <Path path={root ? db.getPath(root) : []} setRoot={setRoot} />
      <List
        blocks={db.getChildren(root)}
        getChildren={db.getChildren}
        setExpanded={setExpanded}
        setRoot={setRoot}
        isTopLevel={true}
      />
      <ChatBox addBlock={db.add} parent={root} />
    </Column>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
