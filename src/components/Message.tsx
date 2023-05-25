import React from 'react';
import { Message as MessageType } from '../messages';
import RelativeTime from './RelativeTime';
import Chat from './Chat';
import { gunContext } from '../gun';
import { useAtom } from 'jotai';
import { chatListRootAtom } from '../atoms';

function Message({ message }: { message: MessageType }) {
  const gun = React.useContext(gunContext);
  const [showReplies, setShowReplies] = React.useState(false);
  const [hasReplies, setHasReplies] = React.useState(false);
  const [root, setRoot] = useAtom(chatListRootAtom);

  React.useEffect(() => {
    gun
      .get('messages')
      .get(message.id)
      .once<MessageType>((message) => {
        setHasReplies(!!message);
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
        onDoubleClick={() => setRoot(message.id)}
      >
        ●
      </span>
      <div className="message__box">
        <span className="message__text">{message.text}</span>
        {showReplies ? <Chat parent={message.id} /> : null}
      </div>
    </li>
  );
}

export default Message;
