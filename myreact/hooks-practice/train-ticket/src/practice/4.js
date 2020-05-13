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
    const person = this.state.person
    person.age = person.age + 1
    this.setState({});
  }

  render() { 
    console.log(this.state.person.age)
    return ( 
      <div>
        <button onClick={this.handleClick}>CLICK</button>
        <Foo person={this.state.person} />
      </div>
    );
  }
}
 
export default App;
