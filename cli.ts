import { promptCLLoop } from 'readline-sync';
import { Chain } from './app';

const chain = Chain();
let branch: string = 'master';

const root = chain.add({ data: '_', ref: null });
chain.setPointer('master', root.id);

const render = () => {
  const pointer = chain.getPointer(branch);
  if (!pointer) return '[]';
  return JSON.stringify(chain.toTree(pointer.base), null, 2);
}

promptCLLoop({
  branch: (name: string) => {
    const block = chain.getBlockAtPointer(branch);
    if (!block) throw new Error(`No block at pointer "${branch}"`);
    chain.setPointer(name, block.id);
    branch = name;
    console.log(render());
  },
  switch: (name: string) => {
    branch = name;
    console.log(render());
  },
  pwd: () => {
    console.log(branch);
  },
  add: (...data: string[]) => {
    chain.addBlockAtPointer(branch, data.join(' '));
    console.log(render());
  },
  log: () => {
    console.log(render());
  },
});