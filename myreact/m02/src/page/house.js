import React from 'react';
import Rack from './rack'
import Dustbin from './dustbin'
import { Switch, Route } from "react-router-dom";

const cardInfo = {
  i: {
    name: 'llp',
    age: 45,
    dynasty: "Qing"
  },
  j: {
    name: 'derp',
    age: 16,
    dynasty: "Gui"
  }
}

const MyContext = React.createContext(cardInfo.i)

function Ceil() {
  return (
    <div>
      <p>----------------</p>
      <p>This is the ceil</p>
      <p>----------------</p>
    </div>
  )
}

function Furniture() { 
  return (
    <React.Fragment>
      <p>Air Conditioning</p>
      <p>Table</p>
      <p>Chairs</p>
      <p>Refrigerator</p>
    </React.Fragment>
  )
}

class Card extends React.Component {
  render() {
    let context = this.context
    return (
      <div>
        <p>there is a card, writes: {context.name}, {context.age}, {context.dynasty}</p>
      </div>
    )
  }
}
Card.contextType = MyContext

function Floor() {
  return (
    <div>
      <Card />
      <p>----------------</p>
      <p>This is the floor</p>
      <p>----------------</p>
    </div>
  )
}

function N404 () {
  return (
    <div className="N404">
      <p>Ouch! This page doesn't exist!</p>
    </div>
  )
}

export default function House ({match}) {
  return (
    <div>
      <Ceil />
      <Furniture />
      <MyContext.Provider value={cardInfo.j}>
        <Floor />
      </MyContext.Provider>

      <Switch>
        <Route path={`${match.path}/dustbin`} component={Dustbin} />
        <Route path={`${match.path}/rack`} component={Rack} />
        <Route component={N404} />
      </Switch>
    </div>
  )
}
