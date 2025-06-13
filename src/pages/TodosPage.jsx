import { useState, useCallback } from 'react';
import TodoList from '../features/TodoList/TodoList.jsx';
import TodoForm from '../features/TodoForm.jsx';
import TodosViewForm from '../features/TodosViewForm.jsx';
import styles from '../App.module.css';

function TodosPage({ 
  todoState, 
  dispatch, 
  handleAddTodo, 
  completeTodo, 
  updateTodo,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString
}) {
  return (
    <div className={styles.appContainer}>
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
            onClick={() => dispatch({ type: 'clearError' })}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default TodosPage; 