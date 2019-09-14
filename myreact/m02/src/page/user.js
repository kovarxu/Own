import React, {useEffect} from "react"
import { connect } from "react-redux"
import { getUsers } from "../store/action"

const User = (attr) => (Comp) => {
  return function (props) {
    useEffect(
      () => {
        props.dispatch(getUsers())
      }, []
    )

    console.log(attr, props[attr])
    if (isEmpty(props[attr])) {
      return <div>Now Loading...</div>
    } else {
      return (
        <React.Fragment>
          <h4>Hear is a bunch of users' information</h4>

          {props[attr].map(user => 
            <Comp data={user} key={user.cell} />  
          )}
          
          <div>
            <p>---------------</p>
            <p>the total comsumed time is: {props.endTimer - props.startTimer} ms.</p>
          </div>
        </React.Fragment>
      )
    }
  }
}

function UserItem(props) {
  let {gender, name, location} = props.data
  let fullname = typeof name === 'string' ? name : `${name.first} ${name.last}`
  return (
    <div>
      <p>---------------</p>
      <p>gender: {gender}</p>
      <p>name: {fullname}</p>
      <p>location: {`${location.state} ${location.city}`}</p>
    </div>
  )
}

function isEmpty(r) {
  return r === undefined || r === null || (Array.isArray(r) && r.length === 0) || (typeof r === 'object' && Object.keys(r).length ===  0)
}

const mapStateToProps = state => ({
  users: state.users.users,
  loading: state.users.loading,
  error: state.users.error,
  startTimer: state.users.startTimer,
  endTimer: state.users.endTimer
});

export default connect(mapStateToProps)(User('users')(UserItem))
