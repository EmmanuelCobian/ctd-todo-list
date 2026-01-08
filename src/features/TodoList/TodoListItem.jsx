import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleEdit = (e) => {
    setWorkingTitle(e.target.value)
  }

  const handleUpdate = (e) => {
    if (!isEditing) return;

    e.preventDefault()
    onUpdateTodo({ ...todo, title: workingTitle })
    setIsEditing(false)
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="button" onClick={handleUpdate}>Update</button>
          </>
        ) : (
          <>
            <input type="checkbox" checked={todo.isCompleted} onChange={(e) => onCompleteTodo(todo.id)} />
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
