export class InMemoryRepository<T extends { id: number }> {
  // private storage
  private items: T[] = [];

  add(entity: T): T {
    this.items.push(entity);
    return entity;
  }

  update(id: number, patch: Partial<T>): T {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Entity with id "${id}" not found`);
    }

    this.items[index] = {
      ...this.items[index],
      ...patch,
    };

    return this.items[index];
  }

  remove(id: number): void {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Entity with id "${id}" not found`);
    }

    this.items.splice(index, 1);
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }
}
