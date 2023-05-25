import React from 'react';
import { Message as MessageType } from '../messages';
import RelativeTime from './RelativeTime';
import Chat from './Chat';

function Message({ message }: { message: MessageType }) {
  const [showReplies, setShowReplies] = React.useState(false);

  const toggleReplies = () => setShowReplies((prev) => !prev);

  return (
    <li key={message.id} className="message">
      <i className="message__date">
        <RelativeTime date={new Date(message.epoch)} />
      </i>
      <span className="message__bullet" onClick={toggleReplies}>
        ●
      </span>
      <div className="message__box">
        <span className="message__text">{message.text}</span>
        {showReplies && <Chat parent={message.id} />}
      </div>
    </li>
  );
}

export default Message;
