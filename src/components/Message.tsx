import React from 'react';
import { MessageSchema, traverse } from '../../shared/messages';
import RelativeTime from './RelativeTime';
import Chat from './Chat';
import { gunContext } from '../gun';
import { useAtom } from 'jotai';
import { chatListPathAtom } from '../atoms';
import { GunDataNode } from 'gun/types';

function Message({ message }: { message: GunDataNode<MessageSchema> }) {
  const gun = React.useContext(gunContext);
  const [showReplies, setShowReplies] = React.useState(false);
  const [hasReplies, setHasReplies] = React.useState(false);
  const [root, setRoot] = useAtom(chatListPathAtom);

  React.useEffect(() => {
    traverse(gun, ['root', message.id])
      .map()
      .once<MessageSchema>((replies) => {
        setHasReplies(!!replies);
      });
  }, []);

  const toggleReplies = () => setShowReplies((prev) => !prev);

  return (
    <li key={message.id} className="message">
      <i className="message__date">
        <RelativeTime date={new Date(message.epoch)} />
      </i>
      <span
        className={`message__bullet ${
          hasReplies ? 'message__bullet--has-replies' : ''
        }`}
        onClick={toggleReplies}
        // onDoubleClick={() => setRoot(message.id)}
      >
        ●
      </span>
      <div className="message__box">
        <span className="message__text">{message.text}</span>
        {showReplies ? (
          <Chat path={message._['#'].split('/').slice(1)} />
        ) : null}
      </div>
    </li>
  );
}

export default Message;
