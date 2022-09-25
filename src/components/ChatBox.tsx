import React from 'react';
import { Datastore } from '../hooks/useDB';
import { enterKey } from '../lib';
import { Block } from '../types';

export interface ChatBoxProps {
  addBlock: Datastore['add'];
  parent: Block['parent'];
}

export const ChatBox = ({ addBlock, parent }: ChatBoxProps) => {
  const [content, setContent] = React.useState('');

  const submit = () => {
    addBlock({
      user: 'user',
      content,
      timestamp: Date.now(),
      expanded: false,
      pinned: false,
      parent,
    });
    setContent('');
    console.log(`Added block to ${parent}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={enterKey(submit)}
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
};
