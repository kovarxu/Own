import React from 'react';
import {randInt} from './utils'

function RackItem(props) {
  return (
    <div>
      <p>{Array(props.min).fill('*').concat('')}</p>
      <p>{Array(props.max).fill('*').concat('')}</p>
    </div>
  )
}

class Ra extends React.Component {
  constructor (props) {
    super(props)
    this.state = {min: randInt(1,5), max: randInt(6,10)}
  }

  render() {
    return (
      <div>
        {this.props.title}
        {this.props.children(this.state)}
      </div>
    )
  }
}

export default class Rack extends React.Component {
  render() {
    let title = <h4>Here is a rake, with some eggs on it</h4>
    return (
      <Ra title={title}>
        {(state) => (<RackItem min={state.min} max={state.max}/>)}
      </Ra>
    )
  }
}

