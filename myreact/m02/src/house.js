import React from 'react';

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

export default class House extends React.Component {
  render() {
    return (
       <div>
        <Ceil />
        <Furniture />
        <MyContext.Provider value={cardInfo.j}>
          <Floor />
        </MyContext.Provider>
      </div>
    )
  }
}
