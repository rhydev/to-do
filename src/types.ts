export interface Snackbar {
  color: string,
  message: string
}

export interface Todo {
  content: string,
  created: number,
  id: string,
  last_edited: number,
  title: string,
  temp: boolean
}

export interface TodoList {
  day: number,
  month: string,
  todos: Array<Todo>
}
