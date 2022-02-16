import { Graph, Node, GraphView } from './graph';

describe("node", () => {
  describe("constructor", () => {
    it("should create a node without a parent", () => {
      const node = new Node("hello");
      expect(node).toEqual({ value: "hello", parent: undefined });
    });

    it("should create a node with a parent", () => {
      const node = new Node(20.25, 0);
      expect(node).toEqual({ value: 20.25, parent: 0 });
    });
  });
});

describe("graph", () => {
  describe("create", () => {
    it("should add a new node", () => {
      const graph = new Graph();
      const added = graph.create(0, new Node("hello"));
      expect(added).toEqual(true);
    });

    it("should not replace a node with a duplicate key", () => {
      const graph = new Graph();
      const first = graph.create(0, new Node("hello"));
      const last = graph.create(0, new Node("world"));
      expect(first).toEqual(true);
      expect(last).toEqual(false);
    });
  });

  describe("insert", () => {
    it("should add a new node", () => {
      const graph = new Graph();
      const added = graph.insert(0, new Node("hello"));
      expect(added).toEqual(undefined);
    });

    it("should replace a node with a duplicate key", () => {
      const graph = new Graph();
      const first = graph.insert(0, new Node("hello"));
      const last = graph.insert(0, new Node("world"));
      expect(first).toEqual(undefined);
      expect(last).toEqual(new Node("hello"));
    });
  });

  describe("get", () => {
    it("should get an existing node", () => {
      const graph = new Graph();
      graph.create(0, new Node("hello"));
      const got = graph.get(0);
      expect(got).toEqual(new Node("hello"));
    });

    it("should not get a non-existing node", () => {
      const graph = new Graph();
      const got = graph.get(0);
      expect(got).toEqual(undefined);
    });
  });

  describe("has", () => {
    it("should find an existing node", () => {
      const graph = new Graph();
      graph.create(0, new Node("hello"));
      const found = graph.has(0);
      expect(found).toEqual(true);
    });

    it("should not find a non-existing node", () => {
      const graph = new Graph();
      const found = graph.has(0);
      expect(found).toEqual(false);
    });
  });
});

describe("graph-view", () => {
  describe("parent", () => {
    it("should get exiting parent from key", () => {
      const graph = new Graph();
      const view = new GraphView(graph);

      graph.create(0, new Node("hello"));
      graph.create(1, new Node("world", 0));

      const parent = view.parent(1);
      expect(parent).toEqual(new Node("hello"));
    });

    it("should get existing parent from node", () => {
      const graph = new Graph();
      const view = new GraphView(graph);

      const world = new Node("world", 0);
      graph.create(0, new Node("hello"));
      graph.create(1, world);

      const parent = view.parent(world);
      expect(parent).toEqual(new Node("hello"));
    });

    it("should not get non-existing parent from key", () => {
      const graph = new Graph();
      const view = new GraphView(graph);

      graph.create(1, new Node("world", 0));

      const parent = view.parent(1);
      expect(parent).toEqual(undefined);
    });

    it("should not get non-existing parent from node", () => {
      const graph = new Graph();
      const view = new GraphView(graph);

      const world = new Node("world", 0);
      graph.create(1, world);

      const parent = view.parent(world);
      expect(parent).toEqual(undefined);
    });
  });

  describe("from", () => {
    it("should loop through parents", () => {
      const graph = new Graph();
      const view = new GraphView(graph);

      graph.create(0, new Node("hello"));
      graph.create(1, new Node("there", 0));
      graph.create(2, new Node("shane", 1));
      graph.create(3, new Node("how", 0));
      graph.create(4, new Node("are", 3));
      graph.create(5, new Node("you", 4));

      const from = view.from(5);
      expect([
        from.next().value,
        from.next().value,
        from.next().value,
        from.next().value,
        from.next().value,
      ]).toEqual([
        new Node("you", 4),
        new Node("are", 3),
        new Node("how", 0),
        new Node("hello"),
        undefined,
      ]);
    });
  });
});

////////////////////////////////////////////////////////////////////////////////

// const debug = (chain: Graph) => JSON.stringify(chain.toTree(), null, 2);

// describe('Chain', () => {
//   describe('Block functions', () => {
//     describe('add', () => {
//       it('should add a block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         expect(chain.get(block.id)).toEqual(block);
//       });

//       it('should add a block with a reference', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });
//         expect(chain.getTrail(block2.id)).toEqual([block.id, block2.id]);
//       });
//     });

//     describe('set', () => {
//       it('should set an existing block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.set(block.id, { data: 'block2' });
//         expect(chain.get(block.id)).toEqual({ ...block, data: 'block2' });
//       });
//     });

//     describe('append', () => {
//       it('should append a block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const trail = [block.id];
//         const append = chain.append(block.id);
//         const block2 = append('block2');
//         trail.push(block2.id);
//         trail.push(append('block3').id);

//         const block4 = append('block4');
//         trail.push(block4.id);

//         expect(chain.get(block2.id)).toEqual({ ...block2, ref: block.id });
//         expect(chain.getTrail(block4.id)).toEqual(trail);
//       });
//     });

//     describe('get', () => {
//       it('should get a block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         expect(chain.get(block.id)).toEqual(block);
//       });

//       it('should return undefined if the block does not exist', () => {
//         const chain = new Graph();
//         expect(chain.get('123')).toBeUndefined();
//       });
//     });

//     describe('getTrail', () => {
//       it('should get the trail of a block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });
//         expect(chain.getTrail(block2.id)).toEqual([block.id, block2.id]);
//       });

//       it('should return an empty array if the block does not exist', () => {
//         const chain = new Graph();
//         expect(chain.getTrail('123')).toEqual([]);
//       });
//     });

//     describe('getReverseTrail', () => {
//       it('should get the reverse trail of a block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const append = chain.append(block.id);
//         const block2 = append('block2');
//         const block3 = append('block3');
//         expect(chain.getReverseTrail(block.id)).toEqual([
//           block.id,
//           block2.id,
//           block3.id,
//         ]);
//       });

//       it('should get the reverse trail of a block and stop at a branch', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const append = chain.append(block.id);
//         const block2 = append('block2');
//         append('block3');
//         chain.add({ data: 'block4', ref: block2.id });
//         expect(chain.getReverseTrail(block.id)).toEqual([block.id, block2.id]);
//       });

//       it('should return an empty array if the block does not exist', () => {
//         const chain = new Graph();
//         expect(chain.getReverseTrail('123')).toEqual([]);
//       });
//     });

//     describe('remove', () => {
//       it('should remove a block', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });

//         chain.remove(block2.id);

//         expect(chain.get(block.id)).toEqual(block);
//         expect(chain.get(block2.id)).toEqual({ ...block2, ref: null });
//       });

//       it('should remove the block but keep the children', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });
//         const block3 = chain.add({ data: 'block3', ref: block.id });
//         const block4 = chain.add({ data: 'block4', ref: block2.id });

//         chain.remove(block.id);

//         expect(chain.get(block.id)).toEqual({ ...block, ref: null });
//         expect(chain.get(block2.id)).toEqual(block2);
//         expect(chain.get(block3.id)).toEqual(block3);
//         expect(chain.get(block4.id)).toEqual(block4);
//       });

//       it('should return undefined if the block does not exist', () => {
//         const chain = new Graph();
//         expect(chain.remove('123')).toBeUndefined();
//       });
//     });
//   });

//   describe('Pointer functions', () => {
//     describe('addPointer', () => {
//       it('should add a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });
//         const pointer = chain.addPointer('master', block2.id);
//         expect(chain.getPointer('master')).toEqual({
//           base: block2.id,
//           tip: block2.id,
//           name: 'master',
//         });
//       });

//       it('should fail if a pointer already exists', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });
//         chain.addPointer('master', block2.id);
//         expect(() => chain.addPointer('master', block2.id)).toThrow(
//           'Pointer "master" already exists'
//         );
//       });
//     });

//     describe('setPointer', () => {
//       it('should update a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         chain.setPointer('master', '456');
//         expect(chain.getPointer('master')).toEqual({
//           base: block.id,
//           tip: '456',
//           name: 'master',
//         });
//       });

//       it('should update the tip and base of a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const block2 = chain.add({ data: 'block2', ref: block.id });
//         chain.addPointer('master', block.id);
//         chain.setPointer('master', block2.id, block2.id);
//         expect(chain.getPointer('master')).toEqual({
//           base: block2.id,
//           tip: block2.id,
//           name: 'master',
//         });
//       });

//       it('should fail if pointer does not exist', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         expect(() => chain.setPointer('master', block.id)).toThrow(
//           'No such pointer "master"'
//         );
//       });
//     });

//     describe('getPointer', () => {
//       it('should get a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         expect(chain.getPointer('master')).toEqual({
//           base: block.id,
//           tip: block.id,
//           name: 'master',
//         });
//       });
//     });

//     describe('removePointer', () => {
//       it('should remove a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         chain.removePointer('master');
//         expect(chain.getPointer('master')).toBeUndefined();
//       });

//       it('should return undefined if pointer does not exist', () => {
//         const chain = new Graph();
//         expect(chain.removePointer('master')).toBeUndefined();
//       });
//     });

//     describe('getBlockAtPointer', () => {
//       it('should get a block at a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         expect(chain.getBlockAtPointer('master')).toEqual(block);
//       });

//       it('should return undefined if the pointer does not exist', () => {
//         const chain = new Graph();
//         expect(chain.getBlockAtPointer('master')).toBeUndefined();
//       });

//       it('should return undefined if the block does not exist', () => {
//         const chain = new Graph();
//         chain.addPointer('master', '456');
//         expect(chain.getBlockAtPointer('master')).toBeUndefined();
//       });
//     });

//     describe('addBlockAtPointer', () => {
//       it('should add a block at a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         const block2 = chain.addBlockAtPointer('master', 'block2');
//         expect(chain.getPointer('master')).toEqual({
//           base: block.id,
//           tip: block2.id,
//           name: 'master',
//         });
//         expect(chain.getBlockAtPointer('master')).toEqual(block2);
//       });
//     });

//     describe('removeBlockAtPointer', () => {
//       it('should remove a block at a pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         chain.removeBlockAtPointer('master');
//         expect(chain.getPointer('master')).toBeUndefined();
//       });

//       it('should remove a pointer if the block does not have a parent', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         chain.addPointer('master', block.id);
//         chain.removeBlockAtPointer('master');
//         expect(chain.getPointer('master')).toBeUndefined();
//       });
//     });

//     describe('fastForward', () => {
//       it('should fast forward the pointer', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const append = chain.append(block.id);
//         chain.addPointer('master', block.id);
//         append('block2');
//         append('block3');
//         const block4 = append('block4');

//         chain.fastForward('master');
//         expect(chain.getPointer('master')).toEqual({
//           base: block.id,
//           tip: block4.id,
//           name: 'master',
//         });
//       });

//       it('should fast forward the pointer right before a branch', () => {
//         const chain = new Graph();
//         const block = chain.add({ data: 'block', ref: null });
//         const append = chain.append(block.id);
//         chain.addPointer('master', block.id);
//         append('block2');
//         const block3 = append('block3');
//         chain.add({ data: 'block4', ref: block3.id });
//         chain.add({ data: 'block5', ref: block3.id });

//         chain.fastForward('master');
//         expect(chain.getPointer('master')).toEqual({
//           base: block.id,
//           tip: block3.id,
//           name: 'master',
//         });
//       });
//     });
//   });

//   it('should generate a tree', () => {
//     const chain = new Graph();
//     const block = chain.add({ data: 'block', ref: null });
//     chain.add({ data: 'block2', ref: null });
//     const append = chain.append(block.id);
//     append('block3');
//     append('block4');

//     chain.addPointer('master', block.id);
//     const tree = JSON.stringify(chain.toTree(), null, 2);
//     // console.log(tree);
//   });
// });
