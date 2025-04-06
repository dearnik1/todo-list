import './App.css'
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'
import { useState } from 'react'

function App() {
  const [newTodo, setNewTodo] = useState(42)
  const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
  ]
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  )
}

export default App