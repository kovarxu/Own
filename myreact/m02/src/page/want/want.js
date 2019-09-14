import React from 'react'
import {
  S_Want,
  S_TopParagraph
} from './want_style'

const NOTICEINFOS = [
  'The price should be less than $50, and detail should be less than 200 words.',
  'Please select goods whose level is less than 4.'
]

class AddtionInfo extends React.Component {
  constructor(props) {
    super(props)
    this.noticeRef = null
    this.onChangeGrade = this.onChangeGrade.bind(this)
  }

  onChangeGrade (e) {
    const lv = e.target.value
    if (lv >= 4) {
      this.noticeRef.innerHTML = NOTICEINFOS[1]
    } else {
      this.noticeRef.innerHTML = NOTICEINFOS[0]
    }
  }

  render () {
    return (
      <div>
        <p>
          <label>grade:</label>
          <input type="number" onChange={this.onChangeGrade} />
        </p>
        <p>
          <label>address:</label>
          <input />
        </p>
        <p>
          <label>tel:</label>
          <input type="number" />
        </p>
        <Notice noticeRef={el => this.noticeRef = el} />
      </div>
    )
  }
}

function Notice (props) {
  return (
    <div ref={props.noticeRef}>
      {NOTICEINFOS[0]}
    </div>
  )
}

export default class Want extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      detail: {}
    }
    this.priceInput = React.createRef()
    this.colorInput = React.createRef()
    this.changeDesireName = this.changeDesireName.bind(this)
  }

  changeDesireName (e) {
    this.priceInput.current.value = ''
    this.colorInput.current.value = ''

    this.setState({
      name: e.target.value
    })
  }

  render () {
    return (
      <S_Want>
        <S_TopParagraph>
          <input data={this.state.name} onChange={this.changeDesireName} />
        </S_TopParagraph>
        <fieldset>
          <legend>Your desire detail</legend>

          <div>
            <label htmlFor="price">Price: </label>
            <input ref={this.priceInput} name="price" />
          </div>
          
          <div>
            <label htmlFor="color">Color: </label>
            <input ref={this.colorInput} name="color" />
          </div>
        </fieldset>
        <hr />
        <AddtionInfo/>
      </S_Want>
    )
  }
}
