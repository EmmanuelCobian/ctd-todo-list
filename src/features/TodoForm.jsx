import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 2rem;
  margin-top: 1rem;
`;

const StyledButton = styled.button`
  font-style: ${(props) => (props.disabled ? 'italic' : 'normal')};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  &:disabled {
    cursor: not-allowed;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const todoTitleInput = useRef(null);

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  };

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        elementId={'todoTitle'}
      />
      <StyledButton disabled={workingTodoTitle.trim().length === 0}>{isSaving ? 'Saving...' : 'Add Todo'}</StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
