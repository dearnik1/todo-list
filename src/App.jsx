import './App.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import { useState, useEffect } from 'react'
import TodosViewForm from './features/TodosViewForm.jsx'

const encodeUrl = ({ baseUrl, sortField, sortDirection }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  return encodeURI(`${baseUrl}?${sortQuery}`);
};

function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [sortField, setSortField] = useState("createdTime")
  const [sortDirection, setSortDirection] = useState("desc")

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // Common fetch options
  const getFetchOptions = (method, body = null) => ({
    method,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) })
  });

  // Common error handling
  const handleError = (error, action) => {
    console.error(error);
    const userFriendlyMessages = {
      'add': 'Unable to add your todo. Please try again.',
      'update': 'Unable to update your todo. Changes have been reverted.',
      'complete': 'Unable to mark your todo as complete. Please try again.',
      'fetch': 'Unable to load your todos. Please refresh the page.'
    };
    setErrorMessage(`${userFriendlyMessages[action] || 'Something went wrong. Please try again.'}`);
  };

  // Common state reversion
  const revertTodoState = (originalTodo) => {
    const revertedTodos = todoList.map((todo) => {
      if (todo.id === originalTodo.id) {
        return { ...originalTodo };
      }
      return todo;
    });
    setTodoList([...revertedTodos]);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const resp = await fetch(encodeUrl({ baseUrl: url, sortField, sortDirection }), getFetchOptions('GET'));
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
        handleError(error, 'fetch');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, url]);
  
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

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl({ baseUrl: url, sortField, sortDirection }), getFetchOptions('POST', payload));
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
      handleError(error, 'add');
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

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl({ baseUrl: url, sortField, sortDirection }), getFetchOptions('PATCH', payload));
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
      handleError(error, 'complete');
      revertTodoState(originalTodo);
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

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl({ baseUrl: url, sortField, sortDirection }), getFetchOptions('PATCH', payload));
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
      handleError(error, 'update');
      revertTodoState(originalTodo);
    } finally {
      setIsSaving(false);
    }
  }
  
  return (
    <div className="app-container">
      <h1 className="app-title">Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm 
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
      {errorMessage && (
        <div className="error-container">
          <hr className="error-divider" />
          <p className="error-message">{errorMessage}</p>
          <button 
            className="error-dismiss-button"
            onClick={() => setErrorMessage("")}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}

export default App