import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  return [...state, todo];
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {
  const index = state.findIndex((todo: Todo): boolean => todo.id === id);

  if (index === -1) {
    throw new Error(`Todo with id "${id}" not found`);
  }

  return state.map((todo: Todo): Todo =>
    todo.id === id ? { ...todo, ...update } : todo,
  );
}

export function removeTodo(state: Todo[], id: number): Todo[] {
  const exists = state.some((todo: Todo): boolean => todo.id === id);

  if (!exists) {
    throw new Error(`Todo with id "${id}" not found`);
  }

  return state.filter((todo) => todo.id !== id);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  return state.find((todo) => todo.id === id);
}
