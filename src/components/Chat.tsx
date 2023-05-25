import React from 'react';
import { gunContext } from '../gun';
import { nanoid } from 'nanoid';
import { Button, EditableText, InputGroup } from '@blueprintjs/core';
import { Message as MessageType, byEpoch, createMessage } from '../messages';
import Message from './Message';

function Chat({ parent }: { parent: MessageType['id'] }) {
  const gun = React.useContext(gunContext);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<MessageType[]>([]);

  React.useEffect(() => {
    // Reset messages (when parent changes)
    setMessages([]);

    // Subscribe to real-time updates
    const messageQuery = gun.get('messages').get(parent);
    messageQuery.map().on<MessageType>((message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((m) => m.id === message.id)) return prevMessages;

        const newMessages = [...prevMessages, message];

        return newMessages.sort(byEpoch);
      });
    });

    return () => {
      // Unsubscribe when the component unmounts
      messageQuery.off();
    };
  }, [parent]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMessage(gun, parent, {
      id: nanoid(),
      text: message,
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
        <li className="message">
          <i
            className="message__date"
            style={{ opacity: 0, userSelect: 'none' }}
          ></i>
          <span className={`message__bullet`}>●</span>
          <form onSubmit={onSubmit} className="chat-box__form">
            <InputGroup
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="chat-box__form__input"
              placeholder="Type a message"
              small
            />
            <Button type="submit" small>
              Send
            </Button>
          </form>
        </li>
      </ul>
    </div>
  );
}

export default Chat;
