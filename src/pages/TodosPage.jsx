import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({ addTodo, completeTodo, updateTodo, todoState, dispatch }) {
  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <TodosViewForm todoState={todoState} dispatch={dispatch} />
    </>
  );
}

export default TodosPage;
