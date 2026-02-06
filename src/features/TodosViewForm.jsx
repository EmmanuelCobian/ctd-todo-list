import { useState, useEffect } from 'react';
import styles from './TodosViewForm.module.css';
import styled from 'styled-components';
import { actions as todoActions } from '../reducers/todos.reducer';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: no-wrap;
  align-items: center;
  margin-top: 1rem;
`;

function TodosViewForm({ todoState, dispatch }) {
  const [localQueryString, setLocalQueryString] = useState(todoState.queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch({ type: todoActions.changeQueryString, localQueryString: localQueryString });
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, dispatch]);

  return (
    <StyledForm onSubmit={(e) => e.preventDefault()}>
      <div className={styles.flexDiv}>
        <label htmlFor="search">Search todos:</label>
        <input
          className={styles.input}
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setLocalQueryString('');
          }}
        >
          Clear
        </button>
      </div>
      <div className={styles.flexDiv}>
        <label className={styles.label} htmlFor="sortBy">
          Sort by
        </label>
        <select
          className={styles.select}
          name="sortBy"
          id="sortBy"
          onChange={(e) => {
            dispatch({ type: todoActions.changeSortField, value: e.target.value });
          }}
          value={todoState.sortField}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label className={styles.label} htmlFor="direction">
          Direction
        </label>
        <select
          className={styles.select}
          name="direction"
          id="direction"
          onChange={(e) => dispatch({ type: todoActions.changeSortDirection, value: e.target.value })}
          value={todoState.sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
