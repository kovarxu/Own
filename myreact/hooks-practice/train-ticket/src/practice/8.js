import React, { Component, memo, useState, useMemo, useCallback } from 'react';

const Bar = memo((props) => {
  console.log('Bar rerendered')

  const handleClick = () => {
    props.onClick(state => state + 1)
  }

  return (
    <div>
      <button onClick={handleClick}>Set Blood</button>
    </div>
  )
})

const Foo = memo((props) => {
  const [blood, setBlood] = useState(2000)

  const junk = useMemo(
    () => {
      console.log('junk executed');
      /(\d+)*a/.test('546845332434344612156215d')
    },
    []
  )

  console.log('Foo rerendered')

  const simpleCb = useCallback((fn) => {
    setBlood(fn)
  }, [])

  return (
    <div>
      <p>in foo</p>
      <span>Blood: {blood}</span>
      <Bar onClick={simpleCb} />
    </div>
  );
})

class App extends Component {
  state = {
    score: 1
  }

  handleClick = () => {
    this.setState(prevState => {
      return { score: prevState.score + 1 };
    });
  }
  
  render() { 
    return (
      <div>
        <button onClick={this.handleClick}>CLICK</button>
        <p>{this.state.score}</p>
        <Foo />
      </div>
    );
  }
}
 
export default App;
