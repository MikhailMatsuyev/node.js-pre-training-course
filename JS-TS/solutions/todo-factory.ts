import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
  const todo: Todo = {
    ...input,
    id: nextId++,
    createdAt: new Date(),
    status: TodoStatus.PENDING,
  };

  return todo;
}
