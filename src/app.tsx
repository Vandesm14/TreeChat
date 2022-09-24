import { createRoot } from 'react-dom/client';
import { List } from './components/List';
import { seedBlocks } from './db';
import { useDB } from './hooks/useDB';
import { Block } from './types';

const App = () => {
  const db = useDB(seedBlocks());

  const setExpanded = (id: Block['id'], expanded: boolean) => {
    if (db.has(id)) {
      db.update({ ...db.get(id)!, expanded });
    }
  };

  const expandAll = () => db.map((block) => ({ ...block, expanded: true }));
  const collapseAll = () => db.map((block) => ({ ...block, expanded: false }));

  return (
    <div>
      <h1>Blocks</h1>
      <button onClick={expandAll}>Expand All</button>
      <button onClick={collapseAll}>Collapse All</button>
      <List
        blocks={db.getRootBlocks()}
        getChildren={db.getChildren}
        setExpanded={setExpanded}
      />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
