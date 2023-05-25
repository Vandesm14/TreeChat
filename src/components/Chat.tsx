import React from 'react';
import { gunContext } from '../gun';
import { nanoid } from 'nanoid';
import { Button, InputGroup } from '@blueprintjs/core';
import { Message as MessageType, byEpoch, createMessage } from '../messages';
import Message from './Message';

function Chat({ parent }: { parent: MessageType['parent'] }) {
  const gun = React.useContext(gunContext);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<MessageType[]>([]);

  React.useEffect(() => {
    // Subscribe to real-time updates
    const messageQuery = gun.get('messages');
    messageQuery.map().on((message) => {
      if (message.parent !== parent) return;
      if (messages.some((m) => m.id === message.id)) return;

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];

        return newMessages.sort(byEpoch);
      });
    });

    return () => {
      // Unsubscribe when the component unmounts
      messageQuery.off();
    };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMessage(gun, {
      id: nanoid(),
      text: message,
      parent: parent ?? '',
      epoch: Date.now(),
    });

    setMessage('');
  };

  return (
    <div className="chat-box">
      <ul className="chat-box__list">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </ul>
      <form onSubmit={onSubmit} className="chat-box__input">
        <InputGroup
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default Chat;
