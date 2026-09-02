import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';
import { InMemoryRepository } from "../solutions/repository";

export class ToDoManager {
  private repository = new InMemoryRepository<Todo>();
  private api = new TodoApi(this.repository);
  private service = new TodoService(this.api);

  async init(): Promise<void> {
    await this.add('Learn TypeScript', 'Practice advanced TypeScript');
    await this.add('Write tests', 'Cover business logic');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    await this.service.toggleStatus(id);
  }

  async list(): Promise<Todo[]> {
    return this.api.getAll();
  }
}
