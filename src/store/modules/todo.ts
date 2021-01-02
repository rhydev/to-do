import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import { Snackbar, Todo, TodoList } from '@/types'

import store from '@/store'

import axios from 'axios'

// Set global axios defaults
axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT
axios.defaults.headers.common = { 'Authorization': `${process.env.VUE_APP_API_TOKEN}` }

// Helpers
function sortByTimestamp(a: Todo, b: Todo): number {
  if (a.created > b.created) return -1
  if (a.created < b.created) return 1
  return 0
}
function unixToMonthDay(timeInSeconds: number): { month: string, day: number } {
  const date: Date = new Date(timeInSeconds * 1000)
  const month: string = date.toLocaleString(undefined, { month: 'long' }).slice(0, 3)
  const day: number = date.getDate()

  return { month, day }
}
function addTodo(todoLists: Array<TodoList>, todo: Todo, date: { month: string, day: number }): void {
  if (todoLists.length > 0 && todoLists[0].day === date.day && todoLists[0].month === date.month) {
    todoLists[0].todos.unshift(todo)
  } else {
    const todoList: TodoList = {
      day: date.day,
      month: date.month,
      todos: [ todo ]
    }

    todoLists.unshift(todoList)
  }
}

const name = 'todo'
// @ts-ignore Hot-reload fix (issue with vuex-module-decorators dynamic modules)
if (store.state[name]) {
  store.unregisterModule(name)
}

@Module({
  dynamic: true,
  store,
  name,
  namespaced: true
})
export default class TodoModule extends VuexModule {
  // State
  public todoDetailsDialog: boolean = false
  public deleteTodoDialog: boolean = false
  public clearTodosDialog: boolean = false
  public blocking: boolean = false
  public tooltip: boolean = false
  public overlay: boolean = false
  public filter: string = ''
  public editing: boolean = false
  public todoEditValid: boolean = true
  public todoLists: Array<TodoList> = []
  public snackbar: Snackbar = {
    color: '',
    message: ''
  }
  public currentTodo: Todo = {
    content: '',
    created: 0,
    id: '',
    last_edited: 0,
    title: '',
    temp: false
  }
  public currentTodoCopy: Todo = {
    content: '',
    created: 0,
    id: '',
    last_edited: 0,
    title: '',
    temp: false
  }

  // Getters
  public get filteredTodos(): Array<TodoList> {
    let filteredTodoLists: Array<TodoList> = JSON.parse(JSON.stringify(this.todoLists))

    filteredTodoLists = filteredTodoLists.filter((todoList: TodoList) => {
      todoList.todos = todoList.todos.filter((todo: Todo) => {
        return todo.content.toLowerCase().includes(this.filter) || todo.title.toLowerCase().includes(this.filter)
      })
      return todoList.todos.length > 0
    })

    return filteredTodoLists
  }

  // Mutations
  @Mutation
  public setBlocking(blocking: boolean): void {
    this.blocking = blocking
  }

  @Mutation
  public setTooltip(tooltip: boolean): void {
    this.tooltip = tooltip
  }

  @Mutation
  public setOverlay(overlay: boolean): void {
    this.overlay = overlay
  }

  @Mutation
  public setSnackbar(snackbar: Snackbar): void {
    this.snackbar = snackbar
  }

  @Mutation
  public setFilter(filter: string): void {
    this.filter = filter
  }

  @Mutation
  public setCurrentTodo(currentTodo: Todo): void {
    this.currentTodo = currentTodo
  }

  @Mutation
  public setCurrentTodoCopy(currentTodoCopy: Todo): void {
    this.currentTodoCopy = currentTodoCopy
  }

  @Mutation
  public setTodoDetailsDialog(todoDetailsDialog: boolean): void {
    this.todoDetailsDialog = todoDetailsDialog
  }

  @Mutation
  public setDeleteTodoDialog(deleteTodoDialog: boolean): void {
    this.deleteTodoDialog = deleteTodoDialog
  }

  @Mutation
  public setClearTodosDialog(clearTodosDialog: boolean): void {
    this.clearTodosDialog = clearTodosDialog
  }

  @Mutation
  public setEditing(editing: boolean): void {
    this.editing = editing
  }

  @Mutation
  public setTodoEditValid(todoEditValid: boolean): void {
    this.todoEditValid = todoEditValid
  }

  @Mutation
  public setTodoLists(todoLists: Array<TodoList>): void {
    this.todoLists = todoLists
  }

  // Actions
  @Action
  public async getTodos(): Promise<void> {
    try {
      this.setBlocking(true)

      // GET request
      const get = await axios.get('/')

      // Sorts data newest to oldest
      const sorted = get.data.sort(sortByTimestamp)

      // Create new Array<TodoList>
      const todoLists: Array<TodoList> = []

      sorted.forEach((todo: Todo) => {
        todo.temp = false // Always false for todos pulled from API

        // Convert unix utc timestamp to local day and month
        const date = unixToMonthDay(todo.created)

        // Organize todoLists by day and month
        const found: TodoList | undefined = todoLists.find((todoList: TodoList) => {
          return todoList.day === date.day && todoList.month === date.month
        })
        if (found !== undefined) {
          found.todos.push(todo)
        } else {
          todoLists.push({
            day: date.day,
            month: date.month,
            todos: [ todo ]
          })
        }
      })

      this.setTodoLists(todoLists)
      this.setFilter('')
      this.setBlocking(false)
    } catch (err) {
      this.setBlocking(false)
      Promise.reject(err)
    }
  }

  @Action
  public async createTodo({ title, content }: { title: string, content: string }): Promise<void> {
    try {
      this.setBlocking(true)
      // POST request
      await axios.post('/', {
        content,
        title
      })

      // GET after post to get id
      const get = await axios.get('/')

      // Sorts data newest to oldest
      const sorted = get.data.sort(sortByTimestamp)


      /* Remove temp todo */

      // Get indices for the todoList in todoLists and the todos in todoList for temp todo
      let index: number = -1
      const todoListsIndex: number = this.todoLists.findIndex((todoList: TodoList) => {
        index = todoList.todos.findIndex((todo: Todo) => todo.temp)
        return index >= 0
      })

      // Remove temp todo from todos or if it is the only todo in the todoList then remove todoList from todoLists
      if (todoListsIndex >= 0) {
        if (this.todoLists[todoListsIndex].todos.length === 1) {
          this.todoLists.splice(todoListsIndex, 1)
        } else {
          this.todoLists[todoListsIndex].todos.splice(index, 1)
        }
      }


      /* Add new Todo */

      // Create new Todo with get data
      const todo: Todo = {
        content: sorted[0].content,
        created: sorted[0].created,
        id: sorted[0].id,
        last_edited: sorted[0].last_edited,
        title: sorted[0].title,
        temp: false
      }

      // Convert unix utc timestamp to local day and month
      const date = unixToMonthDay(sorted[0].created)

      // Add to front of todos array if matching day and month, otherwise create new entry into todoLists
      addTodo(this.todoLists, todo, date)

      this.setOverlay(false)
      this.setBlocking(false)
    } catch (err) {
      this.setBlocking(false)
      return Promise.reject(err)
    }
  }

  @Action
  public async deleteTodo(id: string): Promise<void> {
    try {
      this.setBlocking(true)
      // DELETE request
      await axios.delete(`/${id}`)

      // Get indices for the todoList in todoLists and the todo in todos
      let todoIndex: number = -1
      const todoListsIndex: number = this.todoLists.findIndex((todoList: TodoList) => {
        todoIndex = todoList.todos.findIndex((todo: Todo) => todo.id === id)
        return todoIndex >= 0
      })

      // Remove todo from todos or if it is the only todo in the todoList then remove todoList from todoLists
      if (todoListsIndex >= 0) {
        if (this.todoLists[todoListsIndex].todos.length === 1) {
          this.todoLists.splice(todoListsIndex, 1)
        } else {
          this.todoLists[todoListsIndex].todos.splice(todoIndex, 1)
        }
      }

      this.setBlocking(false)
    } catch (err) {
      this.setBlocking(false)
      return Promise.reject(err)
    }
  }

  @Action
  public async deleteAllTodos(): Promise<void> {
    let deleted: Array<string> = []
    async function del(id: string) {
      axios.delete(`/${id}`)
      deleted.push(id)
    }

    try {
      this.setBlocking(true)
      // Create batch of DELETE requests
      const promises: Array<Promise<void>> = []
      this.todoLists.map((todoList: TodoList) => {
        todoList.todos.map((todo: Todo) => {
          promises.push(del(todo.id))
        })
      })

      // Run batch requests
      await Promise.all(promises)

      this.setTodoLists([])
      this.setBlocking(false)
    } catch (err) {
      // Handle unfinished deletion
      for (let i = this.todoLists.length - 1; i >= 0; i--) {
        // Remove deleted todos
        for (let j = this.todoLists[i].todos.length - 1; j >= 0; j--) {
          if (deleted.includes(this.todoLists[i].todos[j].id)) {
            this.todoLists[i].todos.splice(j, 1)
          }
        }
        // Remove empty todoList
        if (this.todoLists[i].todos.length === 0) {
          this.todoLists.splice(i, 1)
        }
      }

      this.setBlocking(false)
      return Promise.reject(err)
    }
  }

  @Action
  public async editTodo({ id, title, content }: { id: string, title: string, content: string }): Promise<void> {
    try {
      this.setBlocking(true)
      // PUT request
      await axios.put(`/${id}`, {
        title,
        content
      })

      // Update todo in todoList
      let found: boolean = false
      let todoList: TodoList
      for (todoList of this.todoLists) {
        if (found) {
          break
        }

        let todo: Todo
        for (todo of todoList.todos) {
          if (todo.id === id) {
            todo.title = title
            todo.content = content

            found = true
            break
          }
        }
      }

      this.setBlocking(false)
    } catch (err) {
      this.setBlocking(false)
      Promise.reject(err)
    }
  }

  @Action
  public addTempTodo(): void {
    this.setTooltip(false)
    this.setOverlay(true)

    // Create temp Todo
    const todo: Todo = {
      content: '',
      created: 0,
      id: '',
      last_edited: 0,
      title: '',
      temp: true
    }

    // Convert unix utc timestamp to local day and month
    const date = unixToMonthDay(Date.now() / 1000)

    // Add to front of todos array if matching day and month, otherwise create new entry into todoLists
    addTodo(this.todoLists, todo, date)

    this.setFilter('')
  }

  @Action
  public removeTempTodo(): void {
    // Get indices for the todoList in todoLists and the todo in todos
    let index: number = -1
    const todoListsIndex: number = this.todoLists.findIndex((todoList: TodoList) => {
      index = todoList.todos.findIndex((todo: Todo) => todo.temp)
      return index >= 0
    })

    // Remove temp todo from todos or if it is the only todo in the todoList then remove todoList from todoLists
    if (todoListsIndex >= 0) {
      if (this.todoLists[todoListsIndex].todos.length === 1) {
        this.todoLists.splice(todoListsIndex, 1)
      } else {
        this.todoLists[todoListsIndex].todos.splice(index, 1)
      }
    }

    this.setOverlay(false)
  }

  @Action
  public getTodo(id: string): Todo | undefined {
    let found: Todo | undefined = undefined

    for (const todoList of this.todoLists) {
      if (found) break
      for (const todo of todoList.todos) {
        if (todo.id === id) {
          found = todo
          break
        }
      }
    }

    return found
  }

  @Action
  public successMsg(message: string): void {
    this.setSnackbar({
      color: 'success',
      message
    })
  }

  @Action
  public errorMsg(message: string): void {
    this.setSnackbar({
      color: 'error',
      message
    })
  }
}
