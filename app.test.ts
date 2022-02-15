// eslint-env jest

import { Chain } from './app';

const debug = (chain: ReturnType<typeof Chain>) => JSON.stringify(chain.toTree(), null, 2);

describe('Chain', () => {
  describe('Block functions', () => {
    describe('add', () => {
      it('should add a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        expect(chain.get(block.id)).toEqual(block);
      });

      it('should add a block with a reference', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const block2 = chain.add({ data: 'block2', ref: block.id });
        expect(chain.getTrail(block2.id)).toEqual([block.id, block2.id]);
      });
    });

    describe('set', () => {
      it('should set an existing block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        chain.set(block.id, { data: 'block2' });
        expect(chain.get(block.id)).toEqual({ ...block, data: 'block2' });
      });
    });

    describe('append', () => {
      it('should append a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const trail = [block.id];
        const append = chain.append(block.id);
        const block2 = append('block2');
        trail.push(block2.id);
        trail.push(append('block3').id);

        const block4 = append('block4');
        trail.push(block4.id);

        expect(chain.get(block2.id)).toEqual({ ...block2, ref: block.id });
        expect(chain.getTrail(block4.id)).toEqual(trail);
      });
    });

    describe('get', () => {
      it('should get a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
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
        const block = chain.add({ data: 'block', ref: null });
        const block2 = chain.add({ data: 'block2', ref: block.id });
        expect(chain.getTrail(block2.id)).toEqual([block.id, block2.id]);
      });

      it('should return an empty array if the block does not exist', () => {
        const chain = Chain();
        expect(chain.getTrail('123')).toEqual([]);
      });
    });

    describe('getReverseTrail', () => {
      it('should get the reverse trail of a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const append = chain.append(block.id);
        const block2 = append('block2');
        const block3 = append('block3');
        expect(chain.getReverseTrail(block.id)).toEqual([
          block.id,
          block2.id,
          block3.id,
        ]);
      });
      it('should get the reverse trail of a block and stop at a branch', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const append = chain.append(block.id);
        const block2 = append('block2');
        append('block3');
        chain.add({ data: 'block4', ref: block2.id });
        expect(chain.getReverseTrail(block.id)).toEqual([block.id, block2.id]);
      });
    });

    describe('remove', () => {
      it('should remove a block', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const block2 = chain.add({ data: 'block2', ref: block.id });

        chain.remove(block2.id);

        expect(chain.get(block.id)).toEqual(block);
        expect(chain.get(block2.id)).toEqual({ ...block2, ref: null });
      });

      it('should remove the block but keep the children', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const block2 = chain.add({ data: 'block2', ref: block.id });
        const block3 = chain.add({ data: 'block3', ref: block.id });
        const block4 = chain.add({ data: 'block4', ref: block2.id });

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
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        expect(chain.getPointer('master')).toEqual({
          base: block.id,
          tip: block.id,
          name: 'master',
        });
      });

      it('should update a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        chain.setPointer('master', '456');
        expect(chain.getPointer('master')).toEqual({
          base: block.id,
          tip: '456',
          name: 'master',
        });
      });
    });

    describe('getPointer', () => {
      it('should get a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        expect(chain.getPointer('master')).toEqual({
          base: block.id,
          tip: block.id,
          name: 'master',
        });
      });
    });

    describe('removePointer', () => {
      it('should remove a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        chain.removePointer('master');
        expect(chain.getPointer('master')).toBeUndefined();
      });
    });

    describe('getBlockAtPointer', () => {
      it('should get a block at a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
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
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        const block2 = chain.addBlockAtPointer('master', 'block2');
        expect(chain.getPointer('master')).toEqual({
          base: block.id,
          tip: block2.id,
          name: 'master',
        });
        expect(chain.getBlockAtPointer('master')).toEqual(block2);
      });
    });

    describe('removeBlockAtPointer', () => {
      it('should remove a block at a pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        chain.removeBlockAtPointer('master');
        expect(chain.getPointer('master')).toBeUndefined();
      });

      it('should remove a pointer if the block does not have a parent', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        chain.setPointer('master', block.id);
        chain.removeBlockAtPointer('master');
        expect(chain.getPointer('master')).toBeUndefined();
      });
    });

    describe('fastForward', () => {
      it('should fast forward the pointer', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const append = chain.append(block.id);
        chain.setPointer('master', block.id);
        append('block2');
        append('block3');
        const block4 = append('block4');

        chain.fastForward('master');
        expect(chain.getPointer('master')).toEqual({
          base: block.id,
          tip: block4.id,
          name: 'master',
        });
      });

      it('should fast forward the pointer right before a branch', () => {
        const chain = Chain();
        const block = chain.add({ data: 'block', ref: null });
        const append = chain.append(block.id);
        chain.setPointer('master', block.id);
        append('block2');
        const block3 = append('block3');
        chain.add({ data: 'block4', ref: block3.id });
        chain.add({ data: 'block5', ref: block3.id });

        chain.fastForward('master');
        expect(chain.getPointer('master')).toEqual({
          base: block.id,
          tip: block3.id,
          name: 'master',
        });
      });
    });
  });

  it('should generate a tree', () => {
    const chain = Chain();
    const block = chain.add({ data: 'block', ref: null });
    chain.add({ data: 'block2', ref: null });
    const append = chain.append(block.id);
    append('block3');
    append('block4');

    chain.setPointer('master', block.id);
    // console.log(JSON.stringify(chain.toTree(), null, 2));
  });
});
