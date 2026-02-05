const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
};

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  error: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetchTodos: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case actions.loadTodos: {
      const todos = action.records.map((record) => {
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
      return {
        ...state,
        todoList: todos,
        isLoading: false,
      };
    }

    case actions.setLoadError: {
      return {
        ...state,
        error: action.error.message,
        isLoading: false,
      };
    }

    case actions.startRequest: {
      return {
        ...state,
        isSaving: true,
      };
    }

    case actions.addTodo: {
      const savedTodo = {
        title: action.records[0].fields.title,
        isCompleted: true,
        id: action.records[0].id,
      };
      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest: {
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    }

    case actions.revertTodo:
    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return action.editedTodo;
        }
        return todo;
      });

      const updatedState = {
        ...state,
        todoList: updatedTodos,
        error: action.error ? action.error.message : '',
      };
      return updatedState;
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );
      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    case actions.clearError: {
      return {
        ...state,
        error: '',
      };
    }

    default:
      return state;
  }
};

export { initialState, actions, reducer };
