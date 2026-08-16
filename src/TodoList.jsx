import { useState } from 'react';
import './App.css';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [descriptionId, setDescriptionId] = useState(null);
    const [descriptionText, setDescriptionText] = useState('');
    const [showDescriptionIds, setShowDescriptionIds] = useState([]);

    const addTodo = () => {
        if (input.trim() === '') return;

        const newTodo = {
            id: Date.now(),
            text: input,
            description: '',
            completed: false
        };

        setTodos([...todos, newTodo]);
        setInput('');
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));

        setShowDescriptionIds(prev =>
            prev.filter(item => item !== id)
        );

        if (descriptionId === id) {
            setDescriptionId(null);
            setDescriptionText('');
        }

        if (editingId === id) {
            setEditingId(null);
            setEditText('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                if (!todo.completed) {
                    const audio = new Audio('public/notification.wav');
                    audio.play();
                }

                return {
                    ...todo,
                    completed: !todo.completed
                };
            }

            return todo;
        }));
    };

    const handleKeyDownAdd = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };

    const handleKeyDownDescription = (e, id) => {
        if (e.key === 'Enter') {
            saveDescription(id);
        }
    };

    const handelKeyDownsaveEditing = (e, todo) => {
        if (e.key === 'Enter') {
            handleTodo('save', todo);
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

    const handleDescription = (todo) => {
        setDescriptionId(todo.id);
        setDescriptionText(todo.description || '');
    };

    const saveDescription = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id
                ? { ...todo, description: descriptionText }
                : todo
        ));

        setDescriptionId(null);
        setDescriptionText('');

        setShowDescriptionIds(prev =>
            prev.includes(id)
                ? prev
                : [...prev, id]
        );
    };

    const toggleDescription = (id) => {
        setShowDescriptionIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="todo-container">

            <h3>Todo List</h3>

            <div className="todo-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDownAdd}
                />

                <button onClick={addTodo}> اضافه کردن</button>
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
                            <div className="todo-input">
                                <input
                                    value={editText}
                                    onChange={(e) =>
                                        setEditText(e.target.value)
                                    }
                                    onKeyDown={(e) => handelKeyDownsaveEditing(e, todo)}
                                    autoFocus
                                />

                                <button
                                    onClick={() =>
                                        handleTodo('save', todo)}> ذخیره</button>
                            </div>
                        ) : (
                            <>
                                <div className="todo-content">

                                    <span
                                        className={
                                            todo.completed
                                                ? 'completed'
                                                : ''
                                        }
                                        onDoubleClick={() =>
                                            handleDescription(todo)
                                        }>
                                        {todo.text}
                                    </span>

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
                                                onChange={(e) =>
                                                    setDescriptionText(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => { handleKeyDownDescription(e, todo.id) }}
                                                autoFocus
                                            />

                                            <button
                                                onClick={() => saveDescription(todo.id)}> ذخیره</button>
                                        </div>
                                    )}
                                </div>

                                <div className="todo-actions">

                                    <div className="main-actions">

                                        <button
                                            onClick={() => handleTodo('edit', todo)}> ویرایش</button>

                                        <button
                                            onClick={() => deleteTodo(todo.id)}> حذف </button>
                                    </div>

                                    {todo.description && (
                                        <button
                                            className="description-button"
                                            onClick={() => toggleDescription(todo.id)}>

                                            {showDescriptionIds.includes(todo.id)
                                                ? 'مخفی کردن'
                                                : 'توضیحات'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;