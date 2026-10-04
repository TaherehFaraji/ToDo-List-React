import { useState, useContext } from 'react'
import TodoContext from './TodoContext'
import './TodoEdit.css'


function TodoEdit({ todo, onCancel }) {
  const [editText, setEditText] = useState(todo.text)
  const { dispatch } = useContext(TodoContext)

  const handleSave = () => {
    if (editText.trim()) {
      dispatch({
        type: 'EDIT_TODO',
        payload: {
          id: todo.id,
          text: editText
        }
      })

      onCancel()
    }
  }

  return (
    <div className="edit-container">
      <input
        className="edit-input"
        value={editText}
        onChange={e => setEditText(e.target.value)}/>
      <button className="save-btn" onClick={handleSave}>Save</button>
      <button className="cancel-btn" onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default TodoEdit