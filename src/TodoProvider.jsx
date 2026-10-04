import { useReducer } from 'react'
import TodoContext from './TodoContext'

const initialState = {
  todos: [],
  history: []
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            description: '',
            completed: false
          }
        ],
        history: [
          ...state.history,
          state.todos
        ]
      }
    case 'TOGGLE_TODO':
      return {
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
        history: [
          ...state.history,
          state.todos
        ]
      }
    case 'DELETE_TODO':
      return {
        todos: state.todos.filter(
          todo => todo.id !== action.payload
        ),
        history: [
          ...state.history,
          state.todos
        ]
      }
    case 'CLEAR_COMPLETED':
      return {
        todos: state.todos.filter(
          todo => !todo.completed
        ),
        history: [
          ...state.history,
          state.todos
        ]
      }
    case 'EDIT_TODO':
      return {
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? {
              ...todo,
              text: action.payload.text
            }
            : todo
        ),
        history: [
          ...state.history,
          state.todos
        ]
      }
    case 'UNDO':
      if (state.history.length === 0) {
        return state
      }

      return {
        todos: state.history[state.history.length - 1],
        history: state.history.slice(0, -1)
      }
    case 'EDIT_DESCRIPTION':
      return {
        todos: state.todos.map(todo => todo.id === action.payload.id ? { ...todo, description: action.payload.description } : todo),
        history: [...state.history, state.todos]
      }
    default:
      return state
  }
}

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}

export default TodoProvider