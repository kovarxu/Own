import React, { Component, PureComponent, useState, useRef, memo }  from 'react';
import { connect } from 'react-redux';
import './App.css';

const Foo = memo((props) => {
  const { name, onChangeName } = props;
  const [localName, setLocalName] = useState(() => {
    console.log('localname inited');
    return name;
  });
  console.log('foo rendered');
  // const startNameRef = useRef(name);
  // if (startNameRef.current !== localName) {
  //   setLocalName(localName);
  //   startNameRef.current = localName
  // }

  if (localName !== name) {
    setLocalName(name);
  }
  
  const onClick = () => {
    const newName = localName + '@';
    setLocalName(newName);
    onChangeName(newName);
  }

  return (
    <div onClick={onClick}>{localName}</div>
  );
})


const App = (props) => {
  console.log('app rendered');
  const [name, setName] = useState('A');
  const [age, setAge] = useState(2);

  return (
    <div>
      <Foo
        onChangeName={setName}
        name={name}
      />
    </div>
  );
}
 
export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch, ownProps) {
    return { dispatch }
  }
)(App);

// {
//   foo: '',
//   bar: '',
//   isOnline: '',
//   isOfflineVisible: '',
//   shownData: null
// }
