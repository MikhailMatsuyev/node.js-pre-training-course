import { Todo, TodoStatus } from './types';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
  return state.map((todo: Todo) => ({
    ...todo,
    status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING,
  }));
}

export function clearCompleted(state: Todo[]): Todo[] {
  return state.filter((todo: Todo) => todo.status !== TodoStatus.COMPLETED);
}

export function countByStatus(state: Todo[], status: TodoStatus): number {
  return state.reduce(
    (count, todo: Todo) => count + (todo.status === status ? 1 : 0),
    0,
  );
}
