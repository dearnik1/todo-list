import './App.css'
import styles from './App.module.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import { useReducer, useState, useEffect, useCallback } from 'react'
import TodosViewForm from './features/TodosViewForm.jsx'
import logo from './assets/react.svg'
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [sortField, setSortField] = useState("createdTime")
  const [sortDirection, setSortDirection] = useState("desc")
  const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

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
    dispatch({ type: todoActions.setLoadError, error: { message: userFriendlyMessages[action] || 'Something went wrong. Please try again.' } });
  };

  // Common state reversion
  const revertTodoState = (originalTodo) => {
    dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      try {
        const resp = await fetch(encodeUrl(), getFetchOptions('GET'));
        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        handleError(error, 'fetch');
      }
    };
    fetchTodos();
  }, [encodeUrl]);
  
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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), getFetchOptions('POST', payload));
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      handleError(error, 'add');
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  
  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    
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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), getFetchOptions('PATCH', payload));
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      dispatch({ type: todoActions.completeTodo, id });
    } catch (error) {
      handleError(error, 'complete');
      revertTodoState(originalTodo);
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
    
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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), getFetchOptions('PATCH', payload));
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      dispatch({ type: todoActions.updateTodo, editedTodo });
    } catch (error) {
      handleError(error, 'update');
      revertTodoState(originalTodo);
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  
  return (
    <div className={styles.appContainer}>
      <div className={styles.logoTitleWrapper}>
        <img src={logo} alt="Logo" className={styles.logoImg} />
        <h1 className={styles.appTitle}>Todo List</h1>
      </div>
      <TodoForm onAddTodo={handleAddTodo} isSaving={todoState.isSaving} />
      <TodoList 
        todoList={todoState.todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <hr />
      <TodosViewForm 
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString} 
        setQueryString={setQueryString} 
      />
      {todoState.errorMessage && (
        <div className={styles.errorContainer}>
          <hr className="error-divider" />
          <p className="error-message">{todoState.errorMessage}</p>
          <button 
            className="error-dismiss-button"
            onClick={() => dispatch({ type: todoActions.clearError })}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}

export default App