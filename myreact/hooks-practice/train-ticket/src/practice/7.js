import React, { Component, createContext, useContext } from 'react';

const ScoreContext = createContext(0)

// class Bar extends Component {
//   static contextType = ScoreContext
//   state = {  }
//   render() { 
//     return (
//       <div>{this.context}分</div>
//     );
//   }
// }

const Bar = () => {
  const score = useContext(ScoreContext)
  return (
    <div>{score}分</div>
  );
}

function Foo () {
  return <Bar />
}

class App extends Component {
  state = {
    score: 2
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
