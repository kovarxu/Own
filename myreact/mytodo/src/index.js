import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './app.js';

// const EL = function (props) {
//   return (
//     <div>
//       {props.name}
//     </div>
//   )
// }

// class EL extends React.Component {
//   constructor() {
//     this.name = 'name';
//   }
//   render () {
//     return (
//       <div>
//         {this.props.name}
//       </div>
//     )
//   }
// }

// function App () {
//   return (
//     <div>
//       <EL name="sora"></EL>
//       <EL name="lili"></EL>
//       <EL name="jone"></EL>
//     </div>
//   )
// }

// function Clock (props) {
//   return (
//     <div>{props.date}</div>
//   )
// }

class Clock extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      date: new Date().toLocaleTimeString(),
    }
  }

  componentDidMount () {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount () {
    this.timer = null;
  }

  tick () {
    this.setState({
      date: new Date().toLocaleTimeString(),
    })
  }

  render () {
    return (
      <div>{this.state.date}</div>
    )
  }
}

function tick () {
  return ReactDOM.render(<Clock />, document.getElementById('root'));
}

setInterval(tick, 1000);
// ReactDOM.render(<App />, document.getElementById('root'));
