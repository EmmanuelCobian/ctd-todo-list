const actions = {
  fetchTodos: 'fetchTodos',
  fetchTodosSuccess: 'fetchTodosSuccess',
  fetchTodosFailure: 'fetchTodosFailure',

  addTodoRequest: 'addTodoRequest',
  addTodoSuccess: 'addTodoSuccess',
  addTodoFailure: 'addTodoFailure',

  updateTodoRequest: 'updateTodoRequest',
  updateTodoSuccess: 'updateTodoSuccess',
  updateTodoFailure: 'updateTodoFailure',

  completeTodoRequest: 'completeTodoRequest',
  completeTodoSuccess: 'completeTodoSuccess',
  completeTodoFailure: 'completeTodoFailure',

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

    case actions.fetchTodosSuccess: {
      const todos = action.records.map((record) => ({
        title: record.fields.title,
        id: record.id,
        isCompleted: record.fields.isCompleted ?? false,
      }));
      return {
        ...state,
        todoList: todos,
        isLoading: false,
      };
    }

    case actions.fetchTodosFailure: {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
      };
    }

    case actions.addTodoRequest: {
      return {
        ...state,
        isSaving: true,
      };
    }

    case actions.addTodoSuccess: {
      const newTodo = {
        title: action.records[0].fields.title,
        id: action.records[0].id,
        isCompleted: action.records[0].fields.isCompleted ?? false,
      };
      return {
        ...state,
        todoList: [...state.todoList, newTodo],
        isSaving: false,
      };
    }

    case actions.addTodoFailure: {
      return {
        ...state,
        isSaving: false,
        error: action.error.message,
      };
    }

    case actions.updateTodoRequest: {
      return {
        ...state,
        isSaving: true,
      };
    }

    case actions.updateTodoSuccess: {
      const updatedTodos = state.todoList.map((todo) => (todo.id === action.editedTodo.id ? action.editedTodo : todo));
      return {
        ...state,
        todoList: updatedTodos,
        isSaving: false,
      };
    }

    case actions.updateTodoFailure: {
      const revertedTodos = state.todoList.map((todo) =>
        todo.id === action.originalTodo.id ? action.originalTodo : todo
      );
      return {
        ...state,
        todoList: revertedTodos,
        isSaving: false,
        error: action.error.message,
      };
    }

    case actions.completeTodoRequest: {
      return {
        ...state,
        isSaving: true,
      };
    }

    case actions.completeTodoSuccess: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );
      return {
        ...state,
        todoList: updatedTodos,
        isSaving: false,
      };
    }

    case actions.completeTodoFailure: {
      const revertedTodos = state.todoList.map((todo) =>
        todo.id === action.originalTodo.id ? action.originalTodo : todo
      );
      return {
        ...state,
        todoList: revertedTodos,
        isSaving: false,
        error: action.error.message,
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
