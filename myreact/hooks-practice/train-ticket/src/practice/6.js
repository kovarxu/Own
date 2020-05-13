import React, { Component, useState, useEffect } from 'react';

const Foo = (props) => {
  const [score, setScore] = useState(() => props.age)

  function handleClick () {
    console.log('click in foo')
  }

  // 1.只在cdm发生一次
  useEffect(() => {
    console.log('component mounted')
  }, [])

  // 2. cdm + cdu，每次刷新更新一次
  useEffect(() => {
    console.log('updated')
  })

  // 3. cdm + cwu，事件绑定
  useEffect(() => {
    document.documentElement.addEventListener('click', handleClick, false)
    return () => {
      document.documentElement.removeEventListener('click', handleClick, false)
    }
  }, [])

  // 4. cdm + cwu + cdu，每次刷新，最后清理
  // 用class风格的组件更好

  return (
    <div onClick={() => setScore(score + 1)}>{score}</div>
  )
}
 

class App extends Component {
  state = {
    age: 2
  }

  handleClick = () => {
    this.setState(prevState => {
      return { age: prevState.age + 1 };
    });
  }

  render() { 
    return ( 
      <div>
        <button onClick={this.handleClick}>CLICK</button>
        <Foo age={this.state.age} />
      </div>
    );
  }
}
 
export default App;
