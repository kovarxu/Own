import React from 'react'
import { S_L_Container, S_L_Item } from './style'
import Loading from '../../../../common/loading'

const LISTATTRIBUTENAME = 'blogs'

const CreateList = ({ attrname, Common1, Common2, Common3 }) => {
  return function (props) {
    if (!(props[attrname])) {
      return (
        <Common2 />
      )
    } else if (props[attrname].length === 0) {
      return (
        <Common1 />
      )
    } else {
      return (
        <Common3 data={props[attrname]} />
      )
    }
  }
}

function List (props) {
  return (
    <S_L_Container>
      {props.data.map(item => (
        <S_L_Item onClick={() => (gotoLink(item.source))} key={item.title}>
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </S_L_Item>
      ))}
    </S_L_Container>
  )
}

function Empty() {
  return (
    <div>No data</div>
  )
}

function gotoLink (src) {
  location.href = src
}

export default CreateList({
  attrname: LISTATTRIBUTENAME,
  Common1: Loading,
  Common2: Empty,
  Common3: List
})
