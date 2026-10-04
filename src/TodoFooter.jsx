import { useContext } from 'react'
import TodoContext from './TodoContext'
import './TodoFooter.css'

function TodoFooter() {
  const { state, dispatch } = useContext(TodoContext)
  const { todos } = state
  const remaining = todos.filter(t => !t.completed).length

  return (
    <div className="todo-footer">
      <p className="items-left">{remaining} item{remaining !== 1 ? 's' : ''} left</p>
      <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })} className="clear-btn">
        Clear completed
      </button>
    </div>
  )
}
export default TodoFooter