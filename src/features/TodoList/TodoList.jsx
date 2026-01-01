import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  const hasTodos = filteredTodoList.length > 0;

  if (!hasTodos) {
    return <p>Add a todo above to get started</p>;
  }

  return (
    <ul>
      {filteredTodoList.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />
      ))}
    </ul>
  );
}

export default TodoList;
