import { useRef, useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel'
import styled from 'styled-components'

const StyledForm = styled.form`
  margin-bottom: 2rem;
  width: 100%;
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

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState('')
    const todoTitleInput = useRef()
    
    function handleAddTodo(event) {
        event.preventDefault()
        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle('')
        todoTitleInput.current.focus()
    }
    
    return (
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                label="Todo"
                ref={todoTitleInput}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <StyledButton disabled={workingTodoTitle === '' || isSaving}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </StyledButton>
        </StyledForm>
    )
}

export default TodoForm
