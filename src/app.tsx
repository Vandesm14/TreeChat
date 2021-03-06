import { render, FunctionalComponent as FC } from 'preact';
import { useState, StateUpdater, useReducer, useMemo } from 'preact/hooks';
import { Message, Database, createDefaultMessages, User } from './shared';

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
  children: Message[];
  query: Database;
  setCurrentTopic: StateUpdater<Message['id']>;
};

const Message: FC<MessageProps> = ({
  message,
  setCurrentTopic,
  query,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const enterMessage = () => {
    setCurrentTopic(message.id);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="message">
      <div className="hstack">
        <button onClick={toggleExpanded}>{isExpanded ? '-' : '+'}</button>
        <button onClick={enterMessage}>●</button>
        <span>{message.text}</span>
        <span>
          {message.children.length ? `(${message.children.length})` : ''}
        </span>
      </div>
      {isExpanded && (
        <div className="message-children">
          {children.map((child) => (
            <Message
              message={child}
              setCurrentTopic={setCurrentTopic}
              query={query}
              children={query.getChildMessages(child.id)}
            />
          ))}
        </div>
      )}
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
      <input
        type="text"
        value={text}
        onChange={setFromEvent(setText)}
        placeholder="Send a message"
      />
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
      {parent && (
        <a href="javascript:void(0)" onClick={goBack}>
          Go back
        </a>
      )}
      <ul>
        {query.getChildTopics(topicMsg.id).map((message) => (
          <li>
            <a
              href="javascript:void(0)"
              onClick={() => setCurrentTopic(message.id)}
            >
              {message.topic.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

type MessageAction = {
  type: 'add';
  payload: Message;
};

const App = () => {
  const [messages, setMessages] = useReducer(
    (state: Message[], action: MessageAction) => {
      let ret: typeof state = [...state];
      switch (action.type) {
        case 'add':
          ret = [...state, action.payload];
          const topicMsg = state.find((m) => m.id === currentTopic);
          if (topicMsg) {
            topicMsg.children.push(action.payload.id);
            topicMsg.topic ??
              (topicMsg.topic = { name: topicMsg.text, timestamp: Date.now() });
          } else {
            throw new Error('Topic not found');
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
  const [user, setUser] = useState<User>({
    id: snowflake.nextId(),
    name: '',
  });

  return (
    <main>
      <TopicList
        currentTopic={currentTopic}
        setCurrentTopic={setCurrentTopic}
        query={query}
      />
      <section className="messaging">
        <h2>{query.getPathString(currentTopic)}</h2>
        <div className="message-list">
          {query.listMessages(currentTopic).map((m) => (
            <Message
              message={m}
              setCurrentTopic={setCurrentTopic}
              query={query}
              children={query.getChildMessages(m.id)}
            />
          ))}
        </div>
        <div className="hstack">
          <input
            type="text"
            value={user.name}
            onChange={() => setUser({ ...user, name: user.name })}
            placeholder="Username"
          />
          <MessageInput setMessages={setMessages} />
        </div>
      </section>
    </main>
  );
};

render(<App />, document.body);
