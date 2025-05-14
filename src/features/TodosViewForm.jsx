function TodosViewForm() {
  return (
    <form>
      <div>
        <label htmlFor="sort-field-select">Sort by</label>
        <select id="sort-field-select">
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
      </div>
      <div>
        <label htmlFor="sort-direction-select">Direction</label>
        <select id="sort-direction-select">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm; 