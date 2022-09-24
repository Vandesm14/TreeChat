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

  return (
    <div>
      <h1>Blocks</h1>
      <List
        blocks={db.getRootBlocks()}
        getChildren={db.getChildren}
        setExpanded={setExpanded}
      />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
