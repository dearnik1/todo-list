import { useRef, useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel'

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
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                label="Todo"
                ref={todoTitleInput}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <button disabled={workingTodoTitle === '' || isSaving}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </button>
        </form>
    )
}

export default TodoForm
