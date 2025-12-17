import { useRef, useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const todoTitleInput = useRef(null);

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="todoTitle"
        name="title"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      ></input>
      <button disabled={workingTodoTitle.trim().length === 0}>Add Todo</button>
    </form>
  );
}

export default TodoForm;
