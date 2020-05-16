import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './App.css'

import Header from 'src/common/Header';
import Journey from './components/Journey';
import CitySelector from 'src/common/CitySelector';

import {
  exchangeToFrom,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity
} from './actions';

const App = (props) => {
  const { 
    from, 
    to, 
    dispatch,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData
  } = props;

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const cbs = useMemo(() => {
    return bindActionCreators({
            exchangeToFrom,
            showCitySelector
          }, dispatch)
    }, [dispatch]);

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
            onBack: hideCitySelector,
            fetchCityData,
            onSelect: setSelectedCity
          }, dispatch)
    }, [dispatch]);

  return (
    <div>
      <Header title="火车票" onBack={onBack} />
      <form>
        <Journey 
          from={from}
          to={to}
          {...cbs}
        />
      </form>
      <CitySelector 
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
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
