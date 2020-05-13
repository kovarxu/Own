import React, { Component, createContext } from 'react';

const ScoreContext = createContext(90 /* default value */)

class Bar extends Component {
  static contextType = ScoreContext
  render() { 
    console.log('rerendered')
    const score = this.context
    return (
      <span>{score}</span>
    );
  }
}
 

class Foo extends Component {
  state = {  }
  render() { 
    return (
      <div>
        <Bar />
      </div>
    );
  }
}

class App extends Component {
  state = {
    score: 60,
  }

  handleClick = () => {
    this.setState(prevState => {
      return { score: prevState.score + 1 };
    });
  }

  render() { 
    return ( 
      <ScoreContext.Provider value={this.state.score}>
        <div>
          <button onClick={this.handleClick}>CLICK</button>
          <Foo />
        </div>
      </ScoreContext.Provider>
    );
  }
}
 
export default App;
