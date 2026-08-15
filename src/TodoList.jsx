import { useState } from 'react';
import './App.css';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const addTodo = () => {
        if (input.trim() === '') return;

        const newTodo = {
            id: Date.now(),
            text: input,
            completed: false
        };

        setTodos([...todos, newTodo]);
        setInput('');
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id
                ? { ...todo, completed: !todo.completed }
                : todo
        ));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };

    const handleTodo = (action, todo) => {

        if (action === 'edit') {
            setEditingId(todo.id);
            setEditText(todo.text);
        }

        if (action === 'save') {
            if (editText.trim() === '') return;

            setTodos(todos.map(item =>
                item.id === todo.id
                    ? { ...item, text: editText }
                    : item
            ));

            setEditingId(null);
            setEditText('');
        }
    };

    return (
        <div className="todo-container">

            <h3>Todo List</h3>

            <div className="todo-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={addTodo}>اضافه کردن</button>
            </div>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>

                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />

                        {editingId === todo.id ? (
                            <>
                                <div className="todo-input">
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoFocus
                                    />

                                    <button onClick={() => handleTodo('save', todo)}>ذخیره</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className={todo.completed ? 'completed' : ''}>
                                    {todo.text}
                                </span>
                                <button onClick={() => handleTodo('edit', todo)}> ویرایش</button>
                                <button onClick={() => deleteTodo(todo.id)}> حذف</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;