import { useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import TodoContext from './TodoContext'
import './TodoList.css'
import TodoEdit from './TodoEdit'

const ITEMS_PER_PAGE = 5

function TodoList() {
  const { state, dispatch } = useContext(TodoContext)
  const { todos } = state
  const [editingId, setEditingId] = useState(null)
  const [descriptionId, setDescriptionId] = useState(null)
  const [descriptionText, setDescriptionText] = useState('')
  const [showDescriptionIds, setShowDescriptionIds] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const pageFromUrl = Number(searchParams.get('page') || 1)
  const totalPages = Math.max(1, Math.ceil(todos.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(
    Math.max(1, Number.isNaN(pageFromUrl) ? 1 : pageFromUrl),
    totalPages
  )
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const visibleTodos = todos.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    const urlPage = Number(searchParams.get('page') || 1)

    if (Number.isNaN(urlPage) || urlPage !== currentPage) {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(currentPage))
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, currentPage, setSearchParams])

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(1, page), totalPages)
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
  }

  const handleEdit = (id) => {
    setEditingId(id)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDescription = (todo) => {
    setDescriptionId(todo.id)
    setDescriptionText(todo.description || '')
  }

  const saveDescription = (id) => {
    dispatch({
      type: 'EDIT_DESCRIPTION',
      payload: {
        id: id,
        description: descriptionText
      }
    })

    setDescriptionId(null)
    setDescriptionText('')

    setShowDescriptionIds(prev =>
      prev.includes(id) ? prev : [...prev, id]
    )
  }

  const toggleDescription = (id) => {
    setShowDescriptionIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleKeyDownDescription = (e, id) => {
    if (e.key === 'Enter') {
      saveDescription(id)
    }
  }

  const handleToggleTodo = (id, completed) => {
    if (!completed) {
      const audio = new Audio('/notification.wav')
      audio.play()
    }

    dispatch({
      type: 'TOGGLE_TODO',
      payload: id
    })
  }

  const handleDelete = (id) => {
    dispatch({
      type: 'DELETE_TODO',
      payload: id
    })

    setShowDescriptionIds(prev =>
      prev.filter(item => item !== id)
    )

    if (descriptionId === id) {
      setDescriptionId(null)
      setDescriptionText('')
    }

    if (editingId === id) {
      setEditingId(null)
    }
  }

  return (
    <div className="todo-list-wrapper">
      <ul className="todo-list">
        {visibleTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <TodoEdit
                todo={todo}
                onCancel={handleCancel}
              />
            ) : (
              <>
                <div className="todo-content">
                  <div className="todo-main">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    />

                    <span
                      className={`todo-text ${todo.completed ? 'completed' : ''}`}
                      onDoubleClick={() => handleDescription(todo)}
                    >
                      {todo.text}
                    </span>
                  </div>

                  {showDescriptionIds.includes(todo.id) &&
                    todo.description && (
                      <div className="todo-description">
                        {todo.description}
                      </div>
                    )}

                  {descriptionId === todo.id && (
                    <div className="description-input">
                      <input
                        value={descriptionText}
                        onChange={e => setDescriptionText(e.target.value)}
                        onKeyDown={e => handleKeyDownDescription(e, todo.id)}
                        autoFocus
                      />

                      <button onClick={() => saveDescription(todo.id)}>
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="todo-actions">
                  <div className="main-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(todo.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </div>

                  {todo.description && (
                    <button
                      className="description-button"
                      onClick={() => toggleDescription(todo.id)}
                    >
                      {showDescriptionIds.includes(todo.id)
                        ? 'Hide'
                        : 'Description'}
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <button
              key={page}
              type="button"
              className={page === currentPage ? 'active' : ''}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoList