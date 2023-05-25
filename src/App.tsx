import { createRoot } from 'react-dom/client';
import Chat from './components/Chat';
import { gun, gunContext } from './gun';
import React from 'react';
import { useAtom } from 'jotai';
import { chatListRootAtom } from './atoms';
import { Button } from '@blueprintjs/core';

function App() {
  const [root, setRoot] = useAtom(chatListRootAtom);

  React.useEffect(() => {
    // Check if the root message exists, if not, create it
    gun
      .get('messages')
      .get('root')
      .once((message) => {
        if (!message) {
          gun.get('messages').put({
            id: 'root',
            text: '',
            epoch: Date.now(),
          });
        }
      });
  }, []);

  return (
    <gunContext.Provider value={gun}>
      <Chat parent={root} />
      {root !== 'root' ? (
        <Button onClick={() => setRoot('root')}>Back</Button>
      ) : null}
    </gunContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
