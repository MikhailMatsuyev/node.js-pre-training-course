import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(title: string, description?: string): Promise<Todo> {
    throw new Error('create: not implemented');
  }

  async toggleStatus(id: number): Promise<Todo> {
    throw new Error('toggleStatus: not implemented');
  }

  async setStatus(id: number, status: TodoStatus): Promise<Todo> {
    throw new Error('setStatus: not implemented');
  }

  async search(keyword: string): Promise<Todo[]> {
    throw new Error('search: not implemented');
  }
}
