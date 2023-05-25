import { createRoot } from 'react-dom/client';
import Chat from './components/Chat';
import { gun, gunContext } from './gun';
import { useAtom } from 'jotai';
import { chatListPathAtom } from './atoms';
import Path from './components/Path';

function App() {
  const [path] = useAtom(chatListPathAtom);

  return (
    <gunContext.Provider value={gun}>
      <Path path={path} />
      <Chat path={path} />
    </gunContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
