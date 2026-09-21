import { TodoApi } from '../JS-TS/solutions/todo-api';
import { TodoStatus } from '../JS-TS/solutions/types';

describe('Task 06: Simulated API', () => {
  jest.setTimeout(10000);
  let api: TodoApi;

  beforeEach(() => {
    api = new TodoApi();
  });

  it('add then getAll should return newly added item', async () => {
    await api.add({ title: 'Remote' });
    const all = await api.getAll();
    expect(all.length).toBe(1);
    expect(all[0].title).toBe('Remote');
  });

  it('update should change status', async () => {
    const added = await api.add({ title: 'Remote' });
    const updated = await api.update(added.id, { status: TodoStatus.COMPLETED });
    expect(updated.status).toBe(TodoStatus.COMPLETED);
  });

  it('remove should delete item', async () => {
    const added = await api.add({ title: 'Remote' });
    await api.remove(added.id);
    const all = await api.getAll();
    expect(all.length).toBe(0);
  });

  it('update should throw TodoNotFoundError for a non-existing id', async () => {
    await expect(api.update(-1, { status: TodoStatus.COMPLETED })).rejects.toMatchObject({
      name: 'TodoNotFoundError',
    });
  });

  it('remove should throw TodoNotFoundError for a non-existing id', async () => {
    await expect(api.remove(-1)).rejects.toMatchObject({ name: 'TodoNotFoundError' });
  });

  it('each method should simulate 300-600 ms of latency', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(global, 'setTimeout');
    const pending = api.getAll();
    await jest.runAllTimersAsync();
    await pending;
    const delays = spy.mock.calls.map((call) => call[1]);
    expect(delays.length).toBeGreaterThan(0);
    delays.forEach((ms) => {
      expect(ms).toBeGreaterThanOrEqual(300);
      expect(ms).toBeLessThanOrEqual(600);
    });
    jest.useRealTimers();
  });
});
