import { render, FunctionalComponent as FC } from 'preact';
import { useState, StateUpdater, useReducer, useMemo } from 'preact/hooks';
import { Message, Database, createDefaultMessages } from './shared';

import { Worker } from 'snowflake-uuid';
const snowflake = new Worker();

function setFromEvent(fn: StateUpdater<string>) {
  return (e: InputEvent) => {
    fn((e.target as HTMLInputElement).value);
  };
}
type Action<A> = (action: A) => void;

type MessageProps = {
  message: Message;
  setMessages: Action<MessageAction>;
};

const Message: FC<MessageProps> = ({ message, setMessages }) => {
  const enterMessage = () => {
    setMessages({ type: 'enter', payload: message.id });
  };

  return (
    <div className="message">
      <button onClick={enterMessage}>Enter</button>
      <span>{message.text}</span>
      <span>
        {message.children.length ? `(${message.children.length})` : ''}
      </span>
    </div>
  );
};

type MessageInputProps = {
  setMessages: Action<MessageAction>;
};

const MessageInput: FC<MessageInputProps> = ({ setMessages }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setMessages({
      type: 'add',
      payload: {
        id: snowflake.nextId(),
        text: text,
        children: [],
        userId: BigInt(0),
        timestamp: Date.now(),
      },
    });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} class="message-input">
      <input type="text" value={text} onChange={setFromEvent(setText)} />
      <button type="submit">Send</button>
    </form>
  );
};

type TopicListProps = {
  currentTopic: bigint;
  setCurrentTopic: StateUpdater<bigint>;
  query: Database;
};

const TopicList: FC<TopicListProps> = ({
  currentTopic,
  setCurrentTopic,
  query,
}) => {
  const topicMsg = query.getMessage(currentTopic);
  const parent = query.getParentTopic(topicMsg.id);

  const goBack = () => {
    if (parent) {
      setCurrentTopic(parent.id);
    }
  };

  return (
    <section className="topics">
      <p className="topic-current">{topicMsg.topic?.name ?? '(root)'}</p>
      {parent && (
        <a href="javascript:void(0)" onClick={goBack}>
          Go back
        </a>
      )}
    </section>
  );
};

type MessageAction =
  | {
      type: 'add';
      payload: Message;
    }
  | {
      type: 'enter';
      payload: Message['id'];
    };

const App = () => {
  const [messages, setMessages] = useReducer(
    (state: Message[], action: MessageAction) => {
      let ret: typeof state = [...state];
      switch (action.type) {
        case 'add':
          ret = [...state, action.payload];
          const topic = messages.find((m) => m.id === currentTopic);
          if (topic) {
            topic.children.push(action.payload.id);
          } else {
            throw new Error('Topic not found');
          }
          break;
        case 'enter':
          setCurrentTopic(action.payload);
          let message = messages.find((m) => m.id === action.payload);
          if (message) {
            message.topic = {
              name: message.text,
              timestamp: Date.now(),
            };
            ret = [...state.filter((m) => m.id !== action.payload), message];
          } else {
            throw new Error('Message not found');
          }
          break;
      }
      localStorage.setItem(
        'messages',
        JSON.stringify(ret, (_, v) =>
          typeof v === 'bigint' ? v.toString() : v
        )
      );
      return ret;
    },
    localStorage.getItem('messages')
      ? JSON.parse(localStorage.getItem('messages') || '[]')
      : createDefaultMessages()
  );
  const [currentTopic, setCurrentTopic] = useState(messages[0].id);
  const query = useMemo(() => new Database(messages), [messages]);

  return (
    <main>
      <TopicList
        currentTopic={currentTopic}
        setCurrentTopic={setCurrentTopic}
        query={query}
      />
      <section className="messaging">
        <div className="message-list">
          {query.listMessages(currentTopic).map((m) => (
            <Message message={m} setMessages={setMessages} />
          ))}
        </div>
        <MessageInput setMessages={setMessages} />
      </section>
    </main>
  );
};

render(<App />, document.body);
