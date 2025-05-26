import { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  margin-top: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledDiv = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLabel = styled.label`
  min-width: 100px;
  color: var(--text-color);
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const StyledButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

function TodosViewForm({ sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString }) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  const preventRefresh = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledDiv>
        <StyledLabel htmlFor="search-input">Search todos:</StyledLabel>
        <StyledInput 
          type="text" 
          id="search-input" 
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <StyledButton type="button" onClick={() => setLocalQueryString("")}>Clear</StyledButton>
      </StyledDiv>
      <StyledDiv>
        <StyledLabel htmlFor="sort-field-select">Sort by</StyledLabel>
        <StyledSelect 
          id="sort-field-select" 
          value={sortField} 
          onChange={(event) => setSortField(event.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>
      </StyledDiv>
      <StyledDiv>
        <StyledLabel htmlFor="sort-direction-select">Direction</StyledLabel>
        <StyledSelect 
          id="sort-direction-select" 
          value={sortDirection} 
          onChange={(event) => setSortDirection(event.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledDiv>
    </StyledForm>
  );
}

export default TodosViewForm; 