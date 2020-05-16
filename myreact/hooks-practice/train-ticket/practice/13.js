import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import './App.css'
import { createSet, createAdd, createRemove, createToggle, bindActionCreators } from './action'

const Control = memo(function Control(props) {
  const inputRef = useRef()
  const { todoAdd } = props

  function handleSubmit(e) {
    e.preventDefault()
    e.persist()

    const text = inputRef.current.value.trim()

    if (text === '') return

    todoAdd({
      id: new Date().getTime(),
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
})

const TodoList = memo(function TodoList(props) {
  const { todos, todoRemove, todoToggle } = props
  return (
    <ul className="todo-list">
      {
        todos.map(todo => (
          <Todo
            todoRemove={todoRemove}
            todoToggle={todoToggle}
            key={todo.id}
            todo={todo}
          />
        ))
      }
    </ul>
  )
})

const Todo = memo(function Todo(props) {
  const { 
    todoRemove, 
    todoToggle,
    todo: {
      id,
      value,
      active
    }
  } = props
  return (
    <li className="todo-item">  
      <input type="checkbox" onChange={() => todoToggle(id)} />
      <span className={'todo-text ' + (!active ? 'inactive' : '')}>{value}</span>
      <button onClick={() => todoRemove(id)}>RM</button>
    </li>
  )
})

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

  const dispatch = ({ type, payload }) => {
    switch (type) {
      case 'SET': 
        setTodos(payload)
        break
      case 'ADD':
        setTodos([...todos, payload])
        break
      case 'REMOVE':
        setTodos(todos.filter(todo => todo.id !== payload))
        break
      case 'TOGGLE':
        setTodos(todos.map(todo => {
          todo.id === payload && (todo.active = !todo.active)
          return todo
        }))
        break
      default:
        break
    }
  }

  useEffect(() => {
    const cachedTodos = localStorage.getItem(TODO_KEY)
    const { todoSet } = bindActionCreators({
      todoSet: createSet
    }, dispatch)

    if (cachedTodos) {
      todoSet(JSON.parse(cachedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className="todo-wrapper">
      <Control {
        ...bindActionCreators({
          todoAdd: createAdd 
        }, dispatch)
      } />
      <TodoList {
        ...bindActionCreators({
          todoRemove: createRemove,
          todoToggle: createToggle
        }, dispatch)
      } todos={todos} />
    </div>
  );
}

export default App;
