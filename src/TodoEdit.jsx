import { useActionState, useContext } from 'react'
import { useFormStatus } from 'react-dom'
import TodoContext from './TodoContext'
import './TodoEdit.css'

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button type='submit' disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
  )
}

function TodoEdit({ todo, onCancel }) {
  const { dispatch } = useContext(TodoContext)

  const editAction = async (_prevState, formData) => {
    await new Promise(r => setTimeout(r, 1000))
    const text = formData.get('text')?.toString().trim()
    if (!text) {
      return { error: 'Text required' }
    }

    dispatch({
      type: 'EDIT_TODO',
      payload: { id: todo.id, text }
    })

    onCancel()
    return { error: null }
  }

  const [formState, formAction] = useActionState(editAction, { error: null })

  return (
    <form action={formAction} className="edit-container">
      <input
        className="edit-input"
        name='text'
        defaultValue={todo.text}
        autoFocus />
      <SaveButton />
      <button className="cancel-btn" onClick={onCancel}>Cancel</button>
      {formState.error && <p className="form-error">{formState.error}</p>}
    </form>
  )
}


export default TodoEdit