// Importing React and necessary hooks
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash,faPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css';
// App Component
function App() {
  // Defining state for managing todos and input text
  const [todos, setTodos] = useState([]);  // Array of todos
  const [todoText, setTodoText] = useState(''); // Text input for new todo
  const [showCompleted, setShowCompleted] = useState(true); // Show/hide completed todos

  // Add a new todo
  const addTodo=()=>{
    if(todoText.trim()==='') return; //prevent adding empty spaces
    setTodos([...todos,{
      id:Date.now(),
      text:todoText,
      isCompleted:false, //new todos are not completed by default
      isEditing:false
    }]);
    setTodoText(''); //clear input after adding
  };

  //  Toggle todo completion status
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };
    // Step 9: Delete a todo by filtering out the one with matching ID
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  //  Edit todo (switch to edit mode or save new text)
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      )
    );
  };

  //  Toggle edit mode for a specific todo
  const toggleEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  //  Handle filtering of completed todos
  const filteredTodos = showCompleted
    ? todos
    : todos.filter((todo) => !todo.isCompleted);

  return (
    <div className="app-container">
      <h1>Get Things Done!</h1>

      {/*  Todo Form */}
      <div className="todo-form">
        <input
        className='todo-input'
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Enter your todo here..."
        />
              <button className='add-todo-button' onClick={addTodo}> <FontAwesomeIcon icon={faPlus} /> Add Todo</button>
      </div>

      {/* Show Completed Checkbox */}
      <div className="show-completed">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={() => setShowCompleted(!showCompleted)}
        />
        <label>Show Completed</label>
      </div>

      {/* Todo List Rendering */}
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
            />
          ))
        ) : (
         <div className='todo-Not-Found'> <p>You currently have no available task to do.</p></div>
        )}
      </div>

      {/* Delete All Todos Button */}
      <button className='deleteAll-button' onClick={() => setTodos([])}>Delete All <FontAwesomeIcon icon={faTrash} /></button>
    </div>
  );
}

// TodoItem Component for individual todo item
function TodoItem({ todo, toggleComplete, deleteTodo, toggleEdit, editTodo }) {
  const [newText, setNewText] = useState(todo.text); // Local state for editing

  return (
    <div className="todo-item">
      {/* Checkbox to mark as complete */}
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => toggleComplete(todo.id)}
      />

      {/* Show input for editing if in edit mode */}
      {todo.isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      ) : (
        <span style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }}>
          {todo.text}
        </span>
      )}

      {/* 
       Edit and Delete buttons */}
      {todo.isEditing ? (
        <button onClick={() => editTodo(todo.id, newText)}>Save</button>
      ) : (
        <button onClick={() => toggleEdit(todo.id)}><FontAwesomeIcon icon={faEdit} /></button>
      )}
      <button onClick={() => deleteTodo(todo.id)}>
        <FontAwesomeIcon icon={faTrash} />
        </button>
    </div>
  );
}

// Step 21: Export the App component as default
export default App;


