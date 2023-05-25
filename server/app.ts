import { createServer } from 'http';
import Gun from 'gun';
import { createMessage } from '../shared/messages';

const server = createServer().listen(8080);
const gun = Gun({ web: server });

// Check if the root message exists, if not, create it
gun
  .get('messages')
  .get('root')
  .once((message) => {
    if (!message) {
      console.log('Creating root message');
      gun.get('messages').put('root');

      // : hello
      //   : world
      //   : hey!
      // : this is cool
      //   : yes it is!

      const hello = createMessage(gun, ['root'], 'hello');
      const world = createMessage(gun, ['root', hello.id], 'world');
      const hey = createMessage(gun, ['root', hello.id], 'hey!');

      const thisIsCool = createMessage(gun, ['root'], 'this is cool');
      const yesItIs = createMessage(gun, ['root', thisIsCool.id], 'yes it is!');
    }
  });
