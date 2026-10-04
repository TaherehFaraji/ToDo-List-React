import { useState, useContext } from 'react'
import TodoContext from './TodoContext'
import './AddTodo.css'

function AddTodo() {
  const [text, setText] = useState('')
  const { state, dispatch } = useContext(TodoContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      dispatch({ type: 'ADD_TODO', payload: text })
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Add todo..." className="todo-input" />
      <button type="submit" className="add-btn">Add</button>
      <button
        type='button'
        className="undo-btn"
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={state.history.length === 0}>
        Undo
      </button>
    </form>
  )
}
export default AddTodo