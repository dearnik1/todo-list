import './App.css'
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'
import { useState } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])
  const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
  ]
  
  const handleAddTodo = (newTodo) => {
    setTodoList([...todoList, newTodo])
  }
  
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList />
    </div>
  )
}

export default App