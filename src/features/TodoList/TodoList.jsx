import styles from './TodoList.module.css';
import TodoListItem from './TodoListItem';
import { useSearchParams, useNavigate } from 'react-router';
import { useEffect } from 'react';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
  const currentEntries = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);
  const hasTodos = currentEntries.length > 0;
  const navigate = useNavigate();

  const handlePreviousPage = () => {
    setSearchParams((searchParams) => {
      searchParams.set('page', Math.max(1, currentPage - 1));
      return searchParams;
    });
  };

  const handleNextPage = () => {
    setSearchParams((searchParams) => {
      searchParams.set('page', Math.min(totalPages, currentPage + 1));
      return searchParams;
    });
  };

  useEffect(() => {
    if (totalPages > 0 && (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages)) {
      navigate('/');
    }
  }, [currentPage, totalPages, navigate]);

  if (!hasTodos) {
    return <p>Add a todo above to get started</p>;
  }

  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  return (
    <>
      <ul className={styles.list}>
        {currentEntries.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />
        ))}
      </ul>
      <div className="paginationControls">
        <button onClick={handlePreviousPage} disabled={currentPage == 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage == totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default TodoList;
