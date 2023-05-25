import React from 'react';
import { gunContext } from '../gun';
import { IGunInstance } from 'gun';
import { nanoid } from 'nanoid';

type Message = {
  /** The ID of the message */
  id: string;

  /** The text content of the message */
  text: string;

  /** The ID of the parent message */
  parent: string;

  /** The timestamp of the message */
  epoch: number;
};

const byEpoch = (a: Message, b: Message) => a.epoch - b.epoch;

function createMessage(gun: IGunInstance, message: Message) {
  gun.get('messages').get(message.id).put(message);
}

function listMessages(gun: IGunInstance, parent?: Message['parent']) {
  const messages: Message[] = [];
  const messageQuery = parent
    ? gun.get('messages').get(parent)
    : gun.get('messages');
  messageQuery.map().once((message) => {
    messages.push(message);
  });
  return messages.sort(byEpoch);
}

function Chat({}) {
  const gun = React.useContext(gunContext);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    // Subscribe to real-time updates
    const messageQuery = gun.get('messages');
    messageQuery.map().on((message) => {
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
      parent: '',
      epoch: Date.now(),
    });

    setMessage('');
  };

  return (
    <>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <i>{new Date(message.epoch).toLocaleString()}</i>: {message.text}
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default Chat;
