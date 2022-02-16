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

# OT Edge-Cases
## Sending a message at the same time
- Both messages will have the previous message as their parent, causing a divergence
- Our platform requires to explicitly create a new pointer/branch when diverging
- Because of this, we can check if a branch was created and if not, use the timestamps to determine how to reorder the messages

# How We...
## Send a message
- (the system will add a `message` on top of the `current` `branch` and set the tip of the `branch` to the new `message`)

## Create a channel
- Create a new `branch`
- Create a `BranchMessage` on top of the `current` `branch`
- Set the `base` and `tip` of the `branch` to the `BranchMessage`
- Set the `goTo` property to the name of the channel (eg: "#general"; channels start with "3")
- Switch the `current` `branch` to the new `branch`

## Branch off of a message
- Create a new `branch` on any `message`
- Switch the `current` `branch` to the new `branch`
- This creates a divergence from the main (previous) `branch`
  - Any `messages` sent by you will be sent to the new `branch`
  - Any `messages` sent by others will be sent to the previous `branch`