import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { getAirtableUrl, getAuthToken, createOptions } from './lib/api';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${getAirtableUrl()}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const url = encodeUrl();
  const token = getAuthToken();

  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    dispatch({ type: todoActions.completeTodo, id: id });
    const payload = {
      records: [
        {
          id: originalTodo.id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };
    const options = createOptions('PATCH', token, payload);

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error(error.message);
      dispatch({ type: todoActions.completeTodoFailure, originalTodo: originalTodo, error: error });
    }
  };

  const addTodo = async (title) => {
    dispatch({ type: todoActions.addTodoRequest });
    const payload = {
      records: [
        {
          fields: {
            title: title,
            isCompleted: false,
          },
        },
      ],
    };

    const options = createOptions('POST', token, payload);

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodoSuccess, records: records });
    } catch (error) {
      dispatch({ type: todoActions.addTodoFailure, error: error });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({ type: todoActions.updateTodoRequest });
    dispatch({ type: todoActions.updateTodoSuccess, editedTodo: editedTodo });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = createOptions('PATCH', token, payload);

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      dispatch({ type: todoActions.updateTodoFailure, originalTodo: originalTodo, error: error });
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      const options = createOptions('GET', token);

      try {
        const resp = await fetch(url, options);
        const response = await resp.json();
        dispatch({ type: todoActions.fetchTodosSuccess, records: response.records });
      } catch (error) {
        dispatch({ type: todoActions.fetchTodosFailure, error: error });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  if (todoState.error) {
    return (
      <div className={styles.error}>
        <hr />
        <p>{todoState.error}</p>
        <button onClick={() => dispatch({ type: todoActions.clearError })}>Clear error message</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>My Todos</h1>
      <div>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
        <TodoList todoList={todoState.todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={todoState.isLoading} />
        <TodosViewForm
          sortDirection={sortDirection}
          sortField={sortField}
          setSortDirection={setSortDirection}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      </div>
    </div>
  );
}

export default App;
