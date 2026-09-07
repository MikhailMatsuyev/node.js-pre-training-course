import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(title: string, description = ''): Promise<Todo> {
    if (!title.trim()) {
      throw new Error('Title is required');
    }

    return this.api.add({
      title: title.trim(),
      description,
    });
  }

  async toggleStatus(id: number): Promise<Todo> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid todo id');
    }

    const todos = await this.api.getAll();
    const todo = todos.find((item) => item.id === id);

    if (!todo) {
      throw new Error(`Todo with id "${id}" not found`);
    }

    const status =
      todo.status === TodoStatus.COMPLETED
        ? TodoStatus.PENDING
        : TodoStatus.COMPLETED;

    return this.api.update(id, { status });
  }

  async search(keyword: string): Promise<Todo[]> {
    if (!keyword.trim()) {
      throw new Error('Search keyword is required');
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    const todos = await this.api.getAll();

    return todos.filter((todo) => {
      const title = todo.title.toLowerCase();
      const description = todo.description?.toLowerCase() ?? '';

      return (
        title.includes(normalizedKeyword) ||
        description.includes(normalizedKeyword)
      );
    });
  }
}
