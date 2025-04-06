function TodoForm() {
    function handleAddTodo(event) {
        event.preventDefault()
        console.dir(event.target)
    }
    
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" id="todoTitle" name="title" />
            <button>Add Todo</button>
        </form>
    )
}

export default TodoForm
