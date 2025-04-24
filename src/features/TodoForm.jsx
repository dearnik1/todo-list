import { useRef, useState } from 'react'

function TodoForm({ onAddTodo }) {
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
            <label htmlFor="todoTitle">Todo</label>
            <input 
                type="text" 
                id="todoTitle" 
                name="title" 
                ref={todoTitleInput}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
            <button disabled={workingTodoTitle === ''}>Add Todo</button>
        </form>
    )
}

export default TodoForm
