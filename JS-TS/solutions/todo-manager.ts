import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { InMemoryRepository } from './repository';
import { Todo } from './types';

export class ToDoManager {
  private repo = new InMemoryRepository<Todo>();
  private api = new TodoApi(this.repo);
  private service = new TodoService(this.api);

  async init(): Promise<void> {
    throw new Error('init: not implemented');
  }

  async add(title: string, description?: string): Promise<void> {
    throw new Error('add: not implemented');
  }

  async complete(id: number): Promise<void> {
    throw new Error('complete: not implemented');
  }

  async list(): Promise<Todo[]> {
    throw new Error('list: not implemented');
  }
}
