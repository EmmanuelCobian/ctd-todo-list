import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState, useEffect } from 'react';
import { getAirtableUrl, getAuthToken, createOptions } from './lib/api';

const encodeUrl = ({ sortField, sortDirection }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  return encodeURI(`${getAirtableUrl()}?${sortQuery}`);
};

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');

  const url = encodeUrl({ sortField, sortDirection });
  const token = getAuthToken();

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo) => (todo.id === id ? { ...todo, isCompleted: true } : todo));
    setTodoList(updatedTodos);

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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(`Could not complete todo — ${error.message}. Reverting...`);
      const revertedTodos = updatedTodos.map((todo) => (todo.id === originalTodo.id ? originalTodo : todo));
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

  const addTodo = async (title) => {
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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json();
      const savedTodo = {
        title: records[0].fields.title,
        isCompleted: true,
        id: records[0].id,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(`Could not add todo — ${error.message}`);
      console.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      }
      return todo;
    });

    setTodoList(updatedTodos);

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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(`Could not update todo — ${error.message}. Reverting...`);
      const revertedTodos = updatedTodos.map((todo) => (todo.id === originalTodo.id ? originalTodo : todo));
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = createOptions('GET', token);

      try {
        const resp = await fetch(url, options);
        const response = await resp.json();
        const todos = response.records.map((record) => {
          const todo = {
            title: record.fields.title,
            id: record.id,
            isCompleted: false,
          };

          if (Object.hasOwn(record.fields, 'isCompleted') && record.fields.isCompleted) {
            todo.isCompleted = true;
          }

          return todo;
        });
        setTodoList(todos);
      } catch (error) {
        setErrorMessage(`Could not load todos — ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [sortField, sortDirection]);

  if (errorMessage) {
    return (
      <div>
        <hr />
        <p>{errorMessage}</p>
        <button onClick={() => setErrorMessage('')}>Clear error message</button>
      </div>
    );
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={isLoading} />
    </div>
  );
}

export default App;
