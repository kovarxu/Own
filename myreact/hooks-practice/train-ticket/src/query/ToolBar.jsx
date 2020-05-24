import React, { Component } from 'react';

class ToolBar extends Component {
  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.name !== preState.name) {
      return {...preState, name: nextProps.name };
    }
    return preState;
  }

  getSnapshotBeforeUpdate(nextProps, nextState) {
    return 1;
  }

  componentDidUpdate() {
    console.log(arguments);
  }

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      age: 2,
    }
    this.onBack = props.onBack;
  }

  onClick = () => {
    this.setState(prevState => {
      const newState = prevState.name + '#';
      return { name: newState };
    });
    this.onBack(this.state.name + '#');
  }

  render() { 
    return (
      <div>
        <button onClick={this.onClick}>InnerChange</button>
        <span>{this.state.name}</span>
      </div>
    );
  }
}
 
export default ToolBar;
