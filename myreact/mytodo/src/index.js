import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class TodoItem extends React.Component {
  render() {
    return (
      <div className="todo-item">
        {this.props.content}
        <button className="del-btn" onClick={() => this.props.delItem(this.props.index)}>X</button>
      </div>
    )
  }
}

class Todo extends React.Component {
  constructor () {
    super()
    this.state = {
      todolist: [],
      curtext: ''
    }

    this.addTodo = this.addTodo.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.ondelItem = this.ondelItem.bind(this)
  }

  render() {
    return (
      <div className="todo-container">
        <input className="add-input" value={this.state.curtext} placeholder="please input contents" onChange={e => this.onInputChange(e)} />
        <button className="add-btn" onClick={this.addTodo}>Add</button>
        {this.renderTodoItems()}
      </div>
    );
  }

  renderTodoItems () {
    if (this.state.todolist.length) {
      return this.state.todolist.map((item,index) => (
        <TodoItem content={item} index={index} delItem={this.ondelItem} key={getUniqueKey()} />
      ))
    }
  }

  addTodo() {
    const todolist = this.state.todolist

    if (this.state.curtext) {
      todolist.push(this.state.curtext)
      this.setState({
        todolist,
        curtext: ''
      })
    }
  }

  onInputChange(e) {
    this.setState({
      curtext: e.target.value
    })
  }

  ondelItem(index) {
    const todolist = this.state.todolist
    todolist.splice(index, 1)
    this.setState({
      todolist
    })
  }
}

ReactDOM.render(
  <Todo />,
  document.getElementById('root')
)

function getUniqueKey() {
  return ++getUniqueKey.curIndex
}

getUniqueKey.curIndex = 43
