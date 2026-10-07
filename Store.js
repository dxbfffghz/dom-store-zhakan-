/**
 * Store — holds products {name, price, qty}.
 * Logic carried over from Lab 4 (js-core-zhakan), adapted to the new shape.
 */
export class Store {
  #items = [];

  constructor(initial = []) {
    if (!Array.isArray(initial)) {
      throw new TypeError('Store: initial must be an array');
    }
    this.#items = initial.map((item) => ({ ...item }));
  }

  get size() {
    return this.#items.length;
  }

  get items() {
    return this.#items.map((item) => ({ ...item }));
  }

  add(item) {
    if (!item || typeof item !== 'object') {
      throw new TypeError('Store.add: item must be an object');
    }
    this.#items.push({ ...item });
    return this;
  }

  remove(name) {
    const index = this.#items.findIndex((i) => i.name === name);
    if (index === -1) return false;
    this.#items.splice(index, 1);
    return true;
  }

  find(name) {
    const item = this.#items.find((i) => i.name === name);
    return item ? { ...item } : undefined;
  }

  updateQty(name, qty) {
    const item = this.#items.find((i) => i.name === name);
    if (!item) return false;
    item.qty = qty;
    return true;
  }

  total() {
    return this.#items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}