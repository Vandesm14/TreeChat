import { createRoot } from 'react-dom/client';
import Chat from './components/Chat';
import { gun, gunContext } from './gun';
import { useAtom } from 'jotai';
import { chatListPathAtom } from './atoms';
import { Button } from '@blueprintjs/core';
import Path from './components/Path';

function App() {
  const [path, setPath] = useAtom(chatListPathAtom);

  return (
    <gunContext.Provider value={gun}>
      <Path path={path} />
      <Chat path={path} />
      {path.length > 1 ? (
        <Button
          onClick={() => setPath((path) => path.slice(0, path.length - 1))}
        >
          Back
        </Button>
      ) : null}
    </gunContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
