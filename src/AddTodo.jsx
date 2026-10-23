import { useActionState, useContext } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import TodoContext from './TodoContext'
import './AddTodo.css'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type='submit' className='add-btn' disabled={pending}>{pending ? 'Adding..' : 'Add'}</button>
  )
}

function AddTodo() {
  const { state, dispatch } = useContext(TodoContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const ITEMS_PER_PAGE = 5

  const addTodoAction = async (_prevState, formData) => {
    await new Promise(r => setTimeout(r, 500))

    const text = formData.get('text')?.toString().trim()
    if (!text) {
      return { error: 'Please enter a todo', text: '' }
    }

    dispatch({ type: 'ADD_TODO', payload: text })
    const newTotal = state.todos.length + 1
    const newTotalPages = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE))
    const urlPage = Number(searchParams.get('page') || 1)
    const currentPage = Number.isNaN(urlPage) ? 1 : urlPage

    if (newTotalPages > currentPage) {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(newTotalPages))
      setSearchParams(next)
    }
    return { error: null, text: '' }
  }

  const init = { error: null, text: '' }
  const [formState, formAction] = useActionState(addTodoAction, init)

  return (
    <form action={formAction} className="todo-form">
      <input
        name="text"
        defaultValue={formState.text}
        placeholder="Add todo..."
        className="todo-input"
      />
      <SubmitButton />
      <button
        type="button"
        className="undo-btn"
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={state.history.length === 0}
      >
        Undo
      </button>
      {formState.error && <p className="form-error">{formState.error}</p>}
    </form>
  )
}

export default AddTodo