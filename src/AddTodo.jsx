import { useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import TodoContext from './TodoContext'
import './AddTodo.css'

function AddTodo() {
  const [text, setText] = useState('')
  const { state, dispatch } = useContext(TodoContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch({ type: 'ADD_TODO', payload: text })
    setText('')

    const ITEMS_PER_PAGE = 5
    const newTotal = state.todos.length + 1
    const newTotalPages = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE))
    const urlPage = Number(searchParams.get('page') || 1)
    const currentPage = Number.isNaN(urlPage) ? 1 : urlPage

    if (newTotalPages > currentPage) {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(newTotalPages))
      setSearchParams(next)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add todo..."
        className="todo-input"
      />
      <button type="submit" className="add-btn">Add</button>
      <button
        type="button"
        className="undo-btn"
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={state.history.length === 0}
      >
        Undo
      </button>
    </form>
  )
}

export default AddTodo