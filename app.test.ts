// eslint-env jest

import { Chain } from './app';

describe('Chain', () => {
  describe('Block functions', () => {
    describe('add', () => {
      it('should add a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        expect(chain.get(block.id)).toEqual(block);
      });

      it('should add a block with a reference', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const block2 = chain.add({ data: 'World', ref: block.id });
        expect(chain.getTrail(block2.id)).toEqual([block.id, block2.id]);
      });
    });

    describe('set', () => {
      it('should set an existing block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.set(block.id, { data: 'World' });
        expect(chain.get(block.id)).toEqual({ ...block, data: 'World' });
      });
    });

    describe('append', () => {
      it('should append a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const trail = [block.id];
        const append = chain.append(block.id);
        const block2 = append('World');
        trail.push(block2.id);
        trail.push(append('World2').id);

        const block3 = append('World3');
        trail.push(block3.id);

        expect(chain.get(block2.id)).toEqual({ ...block2, ref: block.id });
        expect(chain.getTrail(block3.id)).toEqual(trail);
      });
    });

    describe('get', () => {
      it('should get a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        expect(chain.get(block.id)).toEqual(block);
      });

      it('should return undefined if the block does not exist', () => {
        const chain = Chain();
        expect(chain.get('123')).toBeUndefined();
      });
    });

    describe('getTrail', () => {
      it('should get the trail of a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const block2 = chain.add({ data: 'World', ref: block.id });
        expect(chain.getTrail(block2.id)).toEqual([block.id, block2.id]);
      });

      it('should return an empty array if the block does not exist', () => {
        const chain = Chain();
        expect(chain.getTrail('123')).toEqual([]);
      });
    });

    describe('remove', () => {
      it('should remove a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const block2 = chain.add({ data: 'World', ref: block.id });

        chain.remove(block2.id);

        expect(chain.get(block.id)).toEqual(block);
        expect(chain.get(block2.id)).toEqual({ ...block2, ref: null });
      });

      it('should remove the block but keep the children', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const block2 = chain.add({ data: 'World', ref: block.id });
        const block3 = chain.add({ data: 'World2', ref: block.id });
        const block4 = chain.add({ data: 'World3', ref: block2.id });

        chain.remove(block.id);

        expect(chain.get(block.id)).toEqual({ ...block, ref: null });
        expect(chain.get(block2.id)).toEqual(block2);
        expect(chain.get(block3.id)).toEqual(block3);
        expect(chain.get(block4.id)).toEqual(block4);
      });
    });
  });

  describe('Pointer functions', () => {
    describe('setPointer', () => {
      it('should set a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        expect(chain.getPointer('master')).toEqual(block.id);
      });

      it('should update a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        chain.setPointer('master', '456');
        expect(chain.getPointer('master')).toEqual('456');
      });
    });

    describe('getPointer', () => {
      it('should get a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        expect(chain.getPointer('master')).toEqual(block.id);
      });
    });

    describe('removePointer', () => {
      it('should remove a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        chain.removePointer('master');
        expect(chain.getPointer('master')).toBeUndefined();
      });
    });

    describe('getBlockAtPointer', () => {
      it('should get a block at a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        expect(chain.getBlockAtPointer('master')).toEqual(block);
      });

      it('should return undefined if the pointer does not exist', () => {
        const chain = Chain();
        expect(chain.getBlockAtPointer('master')).toBeUndefined();
      });

      it('should return undefined if the block does not exist', () => {
        const chain = Chain();
        chain.setPointer('master', '456');
        expect(chain.getBlockAtPointer('master')).toBeUndefined();
      });
    });

    describe('addBlockAtPointer', () => {
      it('should add a block at a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        const block2 = chain.addBlockAtPointer('master', 'World');
        expect(chain.getPointer('master')).toEqual(block2.id);
        expect(chain.getBlockAtPointer('master')).toEqual(block2);
      });
    });

    describe('removeBlockAtPointer', () => {
      it('should remove a block at a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        chain.removeBlockAtPointer('master');
        expect(chain.getPointer('master')).toBeUndefined();
      });

      it('should remove a pointer if the block does not have a parent', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        chain.setPointer('master', block.id);
        chain.removeBlockAtPointer('master');
        expect(chain.getPointer('master')).toBeUndefined();
      });
    });

    describe('fastForward', () => {
      it('should fast forward the pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const append = chain.append(block.id);
        chain.setPointer('master', block.id);
        append('World');
        append('World2');
        const block2 = append('World3');

        chain.fastForward('master', block2.id);
        expect(chain.getPointer('master')).toEqual(block2.id);
      });

      it('should fail if the pointer is not part of the same chain', () => {
        const chain = Chain();
        const block = chain.add({ data: 'Hello', ref: null });
        const block2 = chain.add({ data: 'Hello2', ref: null });
        const append = chain.append(block.id);
        append('World');
        append('World2');

        chain.setPointer('master', block.id);
        expect(() => chain.fastForward('master', block2.id)).toThrow(
          `Block "${block2.id}" is not in the same chain as "master"`
        );
      });
    });
  });

  it('should generate a tree', () => {
    const chain = Chain();
    const block = chain.add({ data: 'Hello', ref: null });
    const block2 = chain.add({ data: 'Hello2', ref: null });
    const append = chain.append(block.id);
    append('World');
    append('World2');

    chain.setPointer('master', block.id);
    console.log(JSON.stringify(chain.toTree(), null, 2));
  });
});
