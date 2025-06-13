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
import { Routes, Route, useLocation } from 'react-router-dom';
import TodosPage from './pages/TodosPage.jsx';
import Header from './shared/Header/Header.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [sortField, setSortField] = useState("createdTime")
  const [sortDirection, setSortDirection] = useState("desc")
  const [queryString, setQueryString] = useState("");
  const [title, setTitle] = useState('Todo List');
  const location = useLocation();

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
  
  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('Todo List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);

  return (
    <div className={styles.appContainer}>
      <Header title={title} />
      <Routes>
        <Route path="/" element={
          <TodosPage
            todoState={todoState}
            dispatch={dispatch}
            handleAddTodo={handleAddTodo}
            completeTodo={completeTodo}
            updateTodo={updateTodo}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            queryString={queryString}
            setQueryString={setQueryString}
          />
        } />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App