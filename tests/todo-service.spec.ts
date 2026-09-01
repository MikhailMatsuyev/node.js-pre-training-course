import { TodoApi } from "../JS-TS/solutions/todo-api";
import { TodoService } from "../JS-TS/solutions/todo-service";
import { Todo, TodoStatus } from "../JS-TS/solutions/types";
import { InMemoryRepository } from "../JS-TS/solutions/repository";

describe('TodoService', () => {
  let api: TodoApi;
  let service: TodoService;

  beforeEach(() => {
    jest.useFakeTimers();
    api = new TodoApi();
    service = new TodoService(api);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const resolveDelay = async () => {
    await jest.advanceTimersByTimeAsync(600);
  };

  it('should create a todo', async () => {
    const promise = service.create(
      'Write tests',
      'Cover TodoService',
    );

    await resolveDelay();

    await expect(promise).resolves.toMatchObject({
      title: 'Write tests',
      description: 'Cover TodoService',
      status: TodoStatus.PENDING,
    });
  });

  it('should toggle todo status', async () => {
    const createPromise = service.create('Toggle me');

    await resolveDelay();

    const todo = await createPromise;

    const togglePromise = service.toggleStatus(todo.id);

    await jest.advanceTimersByTimeAsync(1800);

    await expect(togglePromise).resolves.toMatchObject({
      id: todo.id,
      status: TodoStatus.COMPLETED,
    });
  });

  it('should return matching items when searching', async () => {
    const first = service.create('Write tests', 'Jest and TypeScript');
    await resolveDelay();
    await first;

    const second = service.create('Read book', 'Clean Code');
    await resolveDelay();
    await second;

    const searchPromise = service.search('JEST');

    await resolveDelay();

    const result = await searchPromise;

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Write tests');
  });

  it('should throw an error when toggling a non-existing todo', async () => {
    const promise = service.toggleStatus(999);

    const expectation = expect(promise).rejects.toThrow(
      'Todo with id "999" not found',
    );

    await jest.advanceTimersByTimeAsync(600);

    await expectation;
  });

  it('should throw an error when title is empty', async () => {
    await expect(service.create('   ')).rejects.toThrow(
      'Title is required',
    );
  });

  it('should throw an error when id is invalid', async () => {
    await expect(service.toggleStatus(0)).rejects.toThrow(
      'Invalid todo id',
    );
  });

  it('should throw an error when search keyword is empty', async () => {
    await expect(service.search('   ')).rejects.toThrow(
      'Search keyword is required',
    );
  });

  it('should find todos by description case-insensitively', async () => {
    const promise = service.create(
      'Read book',
      'Learn TypeScript',
    );

    await resolveDelay();

    await promise;

    const searchPromise = service.search('typescript');

    await resolveDelay();

    const result = await searchPromise;

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Read book');
  });

  describe('InMemoryRepository', () => {
    let repository: InMemoryRepository<Todo>;

    beforeEach(() => {
      repository = new InMemoryRepository<Todo>();
    });

    it('should add and find a todo', () => {
      const todo: Todo = {
        id: 1,
        title: 'Test todo',
        description: 'Test description',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };

      repository.add(todo);

      expect(repository.findById(1)).toEqual(todo);
    });

    it('should return all todos', () => {
      const todo1: Todo = {
        id: 1,
        title: 'First',
        description: '',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };

      const todo2: Todo = {
        id: 2,
        title: 'Second',
        description: '',
        status: TodoStatus.COMPLETED,
        createdAt: new Date(),
      };

      repository.add(todo1);
      repository.add(todo2);

      expect(repository.findAll()).toEqual([todo1, todo2]);
    });

    it('should update a todo', () => {
      const todo: Todo = {
        id: 1,
        title: 'Old title',
        description: '',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };

      repository.add(todo);

      const updated = repository.update(1, {
        title: 'New title',
        status: TodoStatus.COMPLETED,
      });

      expect(updated).toMatchObject({
        id: 1,
        title: 'New title',
        status: TodoStatus.COMPLETED,
      });
    });

    it('should throw when updating a non-existing todo', () => {
      expect(() => repository.update(999, { title: 'Test' })).toThrow(
        'Entity with id "999" not found',
      );
    });

    it('should remove a todo', () => {
      const todo: Todo = {
        id: 1,
        title: 'Delete me',
        description: '',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };

      repository.add(todo);
      repository.remove(1);

      expect(repository.findById(1)).toBeUndefined();
    });

    it('should throw when removing a non-existing todo', () => {
      expect(() => repository.remove(999)).toThrow(
        'Entity with id "999" not found',
      );
    });
  });

});
