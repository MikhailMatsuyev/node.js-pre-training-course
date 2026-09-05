interface Todo {

}

enum TodoStatus {

}

// TODO Task 1: NewTodo = Todo without id, createdAt and status
type NewTodo = Todo;

export { Todo, TodoStatus, NewTodo };