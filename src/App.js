import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (todoText.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: todoText.trim(),
      isCompleted: false,
      isEditing: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([newTodo, ...todos]);
    setTodoText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    if (newText.trim() === '') {
      deleteTodo(id);
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim(), isEditing: false } : todo
      )
    );
  };

  const toggleEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const cancelEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.isCompleted));
  };

  const deleteAll = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTodos([]);
    }
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.isCompleted).length;
  const completedTodosCount = todos.filter(todo => todo.isCompleted).length;

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Get Things Done! 🚀</h1>
        <p>Organize your tasks and boost productivity</p>
      </div>

      {/* Add Todo Form */}
      <div className="todo-form">
        <div className="input-container">
          <input
            className="todo-input"
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            maxLength={100}
          />
          <button className="add-todo-button" onClick={addTodo} disabled={!todoText.trim()}>
            <FontAwesomeIcon icon={faPlus} />
            Add Task
          </button>
        </div>
        {todoText.length > 0 && (
          <div className="character-count">
            {todoText.length}/100 characters
          </div>
        )}
      </div>

      {/* Stats and Filters */}
      {todos.length > 0 && (
        <div className="todo-stats-filters">
          <div className="todo-stats">
            <span className="stat active">{activeTodosCount} Active</span>
            <span className="stat completed">{completedTodosCount} Completed</span>
            <span className="stat total">{todos.length} Total</span>
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="todo-list-container">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              toggleEdit={toggleEdit}
              editTodo={editTodo}
              cancelEdit={cancelEdit}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks found</h3>
            <p>
              {filter === 'active' 
                ? "You've completed all your tasks! 🎉" 
                : filter === 'completed' 
                ? "No completed tasks yet" 
                : "Add a task to get started!"}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {todos.length > 0 && (
        <div className="action-buttons">
          {completedTodosCount > 0 && (
            <button className="clear-completed-btn" onClick={clearCompleted}>
              <FontAwesomeIcon icon={faTrash} />
              Clear Completed ({completedTodosCount})
            </button>
          )}
          <button className="delete-all-btn" onClick={deleteAll}>
            <FontAwesomeIcon icon={faTrash} />
            Delete All
          </button>
        </div>
      )}
    </div>
  );
}

function TodoItem({ todo, toggleComplete, deleteTodo, toggleEdit, editTodo, cancelEdit }) {
  const [newText, setNewText] = useState(todo.text);

  const handleSave = () => {
    editTodo(todo.id, newText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      cancelEdit(todo.id);
    }
  };

  return (
    <div className={`todo-item ${todo.isCompleted ? 'completed' : ''} ${todo.isEditing ? 'editing' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.isCompleted}
          onChange={() => toggleComplete(todo.id)}
        />
        
        {todo.isEditing ? (
          <div className="edit-container">
            <input
              type="text"
              className="edit-input"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              maxLength={100}
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button className="cancel-btn" onClick={() => cancelEdit(todo.id)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="todo-text" onClick={() => toggleComplete(todo.id)}>
              {todo.text}
            </span>
            <div className="todo-actions">
              <button 
                className="edit-button" 
                onClick={() => toggleEdit(todo.id)}
                title="Edit task"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                className="delete-button" 
                onClick={() => deleteTodo(todo.id)}
                title="Delete task"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;