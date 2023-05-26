import React from 'react';
import { gunContext } from '../gun';
import { Button, InputGroup } from '@blueprintjs/core';
import {
  MessageNode,
  MessageSchema,
  byEpoch,
  createMessage,
  traverse,
} from '../../shared/messages';
import Message from './Message';
import { GunDataNode, IGunOnEvent } from 'gun/types';

function Chat({ path }: { path: MessageSchema['id'][] }) {
  const gun = React.useContext(gunContext);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<GunDataNode<MessageSchema>[]>(
    []
  );

  React.useEffect(() => {
    // Reset messages (when parent changes)
    setMessages([]);

    // Assign the value to messageQuery
    const messageQuery = traverse(gun, path);

    const id = Math.random();
    let event: IGunOnEvent;

    messageQuery.map().on<MessageSchema>((message, key, _, evt) => {
      event = evt;

      console.log(id, path.join('/'), message);

      setMessages((prevMessages) => {
        const parsed = MessageNode.safeParse(message);

        if (!parsed.success || prevMessages.some((m) => m.id === message.id))
          return prevMessages;

        const newMessages = [...prevMessages, message].sort(byEpoch);

        // We don't need these anymore, but I'm saving them in case we do.
        //
        // .filter((msg) => msg.id !== path.at(-1));
        // .filter((msg) => {
        //   // Chop off the first and last parts of the path (first is 'messages' and last is the message ID)
        //   const messagePath = msg._['#'].split('/').slice(1, -1).join('/');
        //   const stringPath = path.join('/');
        //   return messagePath === stringPath;
        // });
        return newMessages;
      });
    });

    return () => {
      if (event) event.off();
    };
  }, [gun, path]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message || message === '') return;

    createMessage(gun, path, message);

    setMessage('');
  };

  return (
    <div className="chat-box">
      <ul className="chat-box__list">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <li className="message" key="in-progress">
          <i
            className="message__date"
            style={{ opacity: 0, userSelect: 'none' }}
          >
            now PM
          </i>
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
