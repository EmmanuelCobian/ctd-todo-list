import { useState, useEffect } from 'react';
import styles from './TodosViewForm.module.css';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: no-wrap;
  align-items: center;
  margin-top: 1rem;
`;

function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

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
            setSortField(e.target.value);
          }}
          value={sortField}
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
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
