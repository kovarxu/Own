import React, { Component, PureComponent, memo } from 'react';

// class Foo extends Component {
//   shouldComponentUpdate(nextProps, nextState) {
//     return this.props.person.age !== nextProps.person.age
//   }

//   render() { 
//     return (
//       <div>
//         {this.props.person.age}
//       </div>
//     )
//   }
// }

const Foo = memo((props) => {
  return ( 
    <div>
      {props.person.age}
    </div>
  );
})
 

class App extends Component {
  state = {
    person: {
      age: 2
    }
  }

  handleClick = () => {
    const age = this.state.person.age + 1
    console.log('age', age)
    this.setState({ person: { ...this.state.person, age } });
  }

  render() { 
    return ( 
      <div>
        <button onClick={this.handleClick}>CLICK</button>
        <Foo person={this.state.person} />
      </div>
    );
  }
}
 
export default App;
