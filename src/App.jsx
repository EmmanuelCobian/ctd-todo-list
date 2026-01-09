import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
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

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json()
      const savedTodo = { title: records[0].fields.title, isCompleted: true, id: records[0].id};

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false
      }
      setTodoList([...todoList, savedTodo])
    } catch (error) {
      setErrorMessage(error.message)
      console.error(error.message)
    } finally {
      setIsSaving(false)
    }
    const newTodo = { title: title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  };

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == editedTodo.id) {
        return { ...todo, title: editedTodo.title };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }

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
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

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
