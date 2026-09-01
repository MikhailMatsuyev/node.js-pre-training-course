import { Todo, NewTodo, TodoStatus } from './types';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id "${id}" not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoApi {
  private repo: Todo[] = [];

  private async delay(): Promise<void> {
    const ms = 300 + Math.floor(Math.random() * 301);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getAll(): Promise<Todo[]> {
    await this.delay();
    return [...this.repo];
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await this.delay();

    const todo: Todo = {
      ...newTodo,
      id: Date.now(),
      status: TodoStatus.PENDING,
      createdAt: new Date(),
    };

    this.repo.push(todo);
    return todo;
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    const index = this.repo.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new TodoNotFoundError(id);
    }

    this.repo[index] = {
      ...this.repo[index],
      ...update,
    };

    return this.repo[index];
  }

  async remove(id: number): Promise<void> {
    await this.delay();

    const index = this.repo.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new TodoNotFoundError(id);
    }

    this.repo.splice(index, 1);
  }
}

const api = new TodoApi();

async function test() {
  await api.add({ title: 'Persist data on server' });
  const todos = await api.getAll();

  console.log(todos);
}

test();
