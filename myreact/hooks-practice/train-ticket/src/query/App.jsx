import React, { 
  memo 
} from "react";
import { connect } from "react-redux";
import "./App.css";
import {
  showSelectSeat,
  hideSelectSeat,
  setCheckedIndices
} from './actions';
import { bindActionCreators } from 'redux';
import SelLayer from './components/SelLayer';

const App = memo((props) => {
  const {
    dispatch,
    isSelectSeatVisible,
    aviableSeatItems,
    checkedIndices,
    isQueryingItems
  } = props;

  const showSelectSeatLayer = () => dispatch(showSelectSeat());

  const selLayerCbs = bindActionCreators({
    hide: hideSelectSeat,
    setCheckedIndices
  }, dispatch);

  return (
    <div>
      <div>MyApp</div>
      <button onClick={showSelectSeatLayer}>showSeatSelect</button>
      <SelLayer 
        isShown={isSelectSeatVisible}
        aviableSeatItems={aviableSeatItems}
        checkedIndices={checkedIndices}
        isQueryingItems={isQueryingItems}
        {...selLayerCbs}
      />
    </div>
  )
});

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch, ownProps) {
    return { dispatch };
  }
)(App);
