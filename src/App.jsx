import './App.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import { useState } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])
  const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
  ]
  
  const handleAddTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false
    }
    setTodoList([...todoList, newTodo])
  }
  
  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true }
      }
      return todo
    })
    setTodoList(updatedTodos)
  }
  
  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo }
      }
      return todo
    })
    setTodoList(updatedTodos)
  }
  
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
      />
    </div>
  )
}

export default App