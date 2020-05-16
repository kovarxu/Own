import React, { useState, useEffect, useRef } from 'react';
import './App.css'

function Control(props) {
  const inputRef = useRef()
  const { addTodo } = props

  function handleSubmit(e) {
    e.preventDefault()
    e.persist()

    const text = inputRef.current.value.trim()

    if (text === '') return

    addTodo({
      id: new Date(),
      value: text,
      active: true
    })

    inputRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="control-container">
      <h1 className="todo-title">TodoList</h1>
      <input className="todo-input" ref={inputRef} />
    </form>
  )
}

function TodoList(props) {
  const { todos, removeTodo, toggleTodo } = props
  return (
    <ul className="todo-list">
      {
        todos.map(todo => (
          <Todo
            removeTodo={removeTodo} 
            toggleTodo={toggleTodo}
            key={todo.id}
            todo={todo}
          />
        ))
      }
    </ul>
  )
}

function Todo(props) {
  const { 
    removeTodo, 
    toggleTodo, 
    todo: {
      id,
      value,
      active
    }
  } = props
  return (
    <li className="todo-item">  
      <input type="checkbox" onChange={() => toggleTodo(id)} />
      <span className={'todo-text ' + (!active ? 'inactive' : '')}>{value}</span>
      <button onClick={() => removeTodo(id)}>RM</button>
    </li>
  )
}

/*
interface Todo {
  id: Date,
  value: string,
  active: boolean
}
*/

const TODO_KEY = '&^%todo-list'

function App (props) {
  const [todos, setTodos] = useState([])

  const addTodo = (todo) => {
    setTodos([...todos, todo])
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => {
      todo.id === id && (todo.active = !todo.active)
      return todo
    }))
  }

  useEffect(() => {
    const cachedTodos = localStorage.getItem(TODO_KEY)
    if (cachedTodos) {
      setTodos(JSON.parse(cachedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className="todo-wrapper">
      <Control addTodo={addTodo} />
      <TodoList removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos} />
    </div>
  );
}

export default App;
