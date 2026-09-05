import { TodoApi } from '../JS-TS/solutions/todo-api';
import { TodoService } from '../JS-TS/solutions/todo-service';
import { TodoStatus } from '../JS-TS/solutions/types';

describe('Task 08: TodoService', () => {
  jest.setTimeout(10000);
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(new TodoApi());
  });

  it('create should add todo', async () => {
    const created = await service.create('Service Item');
    expect(created.title).toBe('Service Item');
  });

  it('toggleStatus should change status', async () => {
    const todo = await service.create('Service Item');
    const toggled = await service.toggleStatus(todo.id);
    expect(toggled.status).toBe(TodoStatus.IN_PROGRESS);
  });

  it('setStatus should set the given status', async () => {
    const todo = await service.create('Service Item');
    const updated = await service.setStatus(todo.id, TodoStatus.COMPLETED);
    expect(updated.status).toBe(TodoStatus.COMPLETED);
  });

  it('setStatus should throw for a non-existing id', async () => {
    await expect(service.setStatus(-1, TodoStatus.COMPLETED)).rejects.toThrow();
  });

  it('search should be case-insensitive', async () => {
    await service.create('Service Item');
    const list = await service.search('SERVICE');
    expect(list.length).toBeGreaterThan(0);
  });

  it('create should reject an empty or whitespace-only title', async () => {
    await expect(service.create('')).rejects.toThrow();
    await expect(service.create('   ')).rejects.toThrow();
  });
});
