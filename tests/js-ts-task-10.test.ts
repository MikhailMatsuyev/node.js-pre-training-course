import { ToDoManager } from '../JS-TS/solutions/todo-manager';
import { TodoStatus } from '../JS-TS/solutions/types';

describe('Task 10: ToDoManager Facade', () => {
  jest.setTimeout(10000);
  let manager: ToDoManager;

  beforeEach(() => {
    manager = new ToDoManager();
  });

  it('init should seed data', async () => {
    await manager.init();
    const list = await manager.list();
    expect(list.length).toBeGreaterThan(0);
  });

  it('add/complete/list should work together', async () => {
    await manager.add('CLI Item');
    let list = await manager.list();
    const item = list.find((t) => t.title === 'CLI Item')!;
    await manager.complete(item.id);
    list = await manager.list();
    const completed = list.find((t) => t.id === item.id)!;
    expect(completed.status).toBe(TodoStatus.COMPLETED);
  });
});
