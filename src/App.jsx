import TodoProvider from './TodoProvider'
import AddTodo from './AddTodo'
import TodoList from './TodoList'
import TodoFooter from './TodoFooter'
import './App.css'

function App() {
  return (
    <>
      <TodoProvider>
        <div className="todo-container">
          <h1>Todo List</h1>
          <AddTodo />
          <TodoList />
          <TodoFooter />
        </div>
      </TodoProvider>
    </>
  )
}

export default App
