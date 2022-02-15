import { Chain } from './app';

interface Message {
  id: string;
  user: string;
  text: string;
}

enum ActionType {
  MOVE = 'MOVE',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
}

interface Action {
  id: string;
  type: ActionType;
  args?: Record<string, any>;
}

class TreeChat {
  chain: Chain;

  constructor(chain?: Chain) {
    if (chain) {
      this.chain = new Chain(chain);
    } else {
      this.chain = new Chain();
      this.chain.add({ data: 'root', ref: null });
    }
    return this;
  }
}
