import { createRoot } from 'react-dom/client';
import Chat from './components/Chat';
import { gun, gunContext } from './gun';

function App() {
  return (
    <gunContext.Provider value={gun}>
      <Chat parent="" />
    </gunContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
