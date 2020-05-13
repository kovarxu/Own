import React, { Component, useState } from 'react';

const Foo = (props) => {
  const [score, setScore] = useState(() => props.age)
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
