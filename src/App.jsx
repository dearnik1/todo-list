import './App.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import { useState, useEffect } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: "GET",
        headers: {
          "Authorization": token
        }
      };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const { records } = await resp.json();
        const fetchedTodos = records.map(record => {
          const todo = {
            id: record.id,
            ...record.fields
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);
  
  const handleAddTodo = async (title) => {
    const newTodo = {
      title: title,
      isCompleted: false
    }

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields
      };
      
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }
  
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const updatedTodos = todoList.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
      setTodoList(updatedTodos);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        }
        return todo;
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }
  
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const updatedTodos = todoList.map((todo) => {
        if (todo.id === editedTodo.id) {
          return { ...editedTodo };
        }
        return todo;
      });
      setTodoList(updatedTodos);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        }
        return todo;
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }
  
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  )
}

export default App