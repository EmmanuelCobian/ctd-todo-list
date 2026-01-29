import { useState, useEffect } from 'react';
import styles from './TodoListItem.module.css'
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

  useEffect(() => {
    setWorkingTitle(todo.title)
  }, [todo])

  return (
    <li className={styles.item}>
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
