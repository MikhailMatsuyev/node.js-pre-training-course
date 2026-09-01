import { InMemoryRepository } from './repository';
import { Todo, NewTodo, TodoStatus } from './types';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id "${id}" not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();

  private async delay(): Promise<void> {
    const ms = 300 + Math.floor(Math.random() * 301);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getAll(): Promise<Todo[]> {
    await this.delay();

    return this.repo.findAll();
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await this.delay();

    const todo: Todo = {
      ...newTodo,
      id: Date.now(),
      status: TodoStatus.PENDING,
      createdAt: new Date(),
    };

    return this.repo.add(todo);
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.delay();

    if (!this.repo.findById(id)) {
      throw new TodoNotFoundError(id);
    }

    return this.repo.update(id, update);
  }

  async remove(id: number): Promise<void> {
    await this.delay();

    if (!this.repo.findById(id)) {
      throw new TodoNotFoundError(id);
    }

    this.repo.remove(id);
  }
}

const api = new TodoApi();

async function test(): Promise<void> {
  await api.add({ title: 'Persist data on server' });
  const todos = await api.getAll();

  console.log(todos);
}

test();

