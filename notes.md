# Client
- [ ] View all threads (sort by recent and created)
- [ ] View most recent messages for a thread
- [ ] Lazy load messages
- [ ] Send messages in a thread
- [ ] Branch off of a message (create a thread)
  - [ ] Threads must have a name
  - [ ] Branch off of a null message (create a thread without a parent message)
  - [ ] Channels start with "#" (pinned in the UI)
  - [ ] Threads that branch from messages are categorized as replies
    - [ ] Replies can be displayed inline (like Reddit comments)
- [ ] Delete message (turns into a tombstone)
- [ ] Edit message
- [ ] Mentions
  - [ ] User
  - [ ] Thread
  - [ ] Message

# Message Types
- [ ] Default (no type or "message")
  - [ ] User
  - [ ] Text (message)
- [ ] Null (for branching off of a null message)
- [ ] Deleted (for turning a message into a tombstone)
  - [ ] User (deleted by)
  - [ ] Text (unix timestamp of deletion)

# Other Platforms
## Discord
- Messages
- Replies (anonymous threads; tied to a message; only one message)
- Named Threads (tied to a message)
- Channels (can use the "channel" implementation as listed in the [Client](#Client) section)

## Slack
- Messages
- Threads (anonymous threads; tied to a message; many messages)
- Channels (can use the "channel" implementation as listed in the [Client](#Client) section)

## Reddit
- Comments (can be nested or not)