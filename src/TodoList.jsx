import TodoListItem from './TodoListItem';

function TodoList({ todoList }) {
  return (
    <>
      {todoList.length === 0 ? (
        <p>Add a todo above to get started</p>
      ) : (
        <ul>
          {todoList.map((todo) => (
            <TodoListItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
