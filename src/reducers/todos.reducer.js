const actions = {
  fetchTodos: 'fetchTodos',
  fetchTodosSuccess: 'fetchTodosSuccess',
  fetchTodosFailure: 'fetchTodosFailure',

  addTodoRequest: 'addTodoRequest',
  addTodoSuccess: 'addTodoSuccess',
  addTodoFailure: 'addTodoFailure',

  updateTodo: 'updateTodo',
  updateTodoFailure: 'updateTodoFailure',

  completeTodo: 'completeTodo',
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

    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) => (todo.id === action.editedTodo.id ? action.editedTodo : todo));
      return {
        ...state,
        todoList: updatedTodos,
        isSaving: false,
      };
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );
      return {
        ...state,
        todoList: updatedTodos,
        isSaving: false,
      };
    }

    case actions.completeTodoFailure:
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
