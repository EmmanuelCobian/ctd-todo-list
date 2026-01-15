function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
  const preventRefresh = () => {
    return false;
  };

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          value={queryString}
          onChange={(e) => {
            setQueryString(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setQueryString('');
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label htmlFor="sortBy">Sort by</label>
        <select
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

        <label htmlFor="direction">Direction</label>
        <select
          name="direction"
          id="direction"
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
