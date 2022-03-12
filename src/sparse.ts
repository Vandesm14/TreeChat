export class SparseSet<T> {
  #sparse: number[] = [];
  #dense: [number, T][] = [];
  #length = 0;

  get length(): number {
    return this.#length;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.#length; i++) {
      yield this.#dense[i][1];
    }
  }

  toJSON() {
    return { sparse: this.#sparse, dense: this.#dense };
  }

  has(id: number): boolean {
    const denseIndex = this.#sparse[id];
    return denseIndex < this.#length && this.#dense[denseIndex][0] === id;
  }

  insert(id: number, data: T): void {
    if (this.has(id)) return;
    this.#dense[this.#length] = [id, data];
    this.#sparse[id] = this.#length;
    this.#length++;
  }

  get(id: number): T | undefined {
    if (!this.has(id)) return undefined;
    return this.#dense[this.#sparse[id]][1];
  }

  remove(id: number): void {
    if (this.has(id)) {
      this.#length--;
      const denseIndex = this.#sparse[id];
      const item = this.#dense[this.#length];
      this.#dense[denseIndex] = item;
      this.#sparse[item[0]] = denseIndex;
    }
  }

  clear(): void {
    this.#length = 0;
  }
}