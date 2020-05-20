import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './App.css'

import Header from 'src/common/Header';
import Journey from './components/Journey';
import CitySelector from 'src/common/CitySelector';
import DateSelector from 'src/common/DateSelector';
import Depart from './components/Depart';
import HighSpeed from './components/HighSpeed';
import Submit from './components/Submit';

import {
  exchangeToFrom,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDeteSelector,
  hideDeteSelector,
  setSelectedDate,
  toggleOnlyHighSpeed
} from './actions';

const App = (props) => {
  const { 
    from, 
    to, 
    dispatch,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData,
    isDateSelectorVisible,
    selectedDate,
    isOnlyHighSpeed
  } = props;

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const cbs = useMemo(() => {
    return bindActionCreators({
            exchangeToFrom,
            showCitySelector
          }, dispatch)
    }, [dispatch]
  );

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
            onBack: hideCitySelector,
            fetchCityData,
            onSelect: setSelectedCity
          }, dispatch)
    }, [dispatch]
  );

  const departCbs = useMemo(() => {
    return bindActionCreators({
      showDeteSelector
    }, dispatch)
  }, [dispatch])

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideDeteSelector,
      onSelect: setSelectedDate
    }, dispatch)
  }, [dispatch])
  
  const highSpeedCbs = useMemo(() => {
    return bindActionCreators({
      onToggle: toggleOnlyHighSpeed
    }, dispatch)
  }, [dispatch])
  

  return (
    <div>
      <Header title="火车票" onBack={onBack} />
      <form action="/query.html">
        <Journey 
          from={from}
          to={to}
          {...cbs}
        />
        <Depart 
          departDate={selectedDate}
          {...departCbs}
        />
        <HighSpeed
          onlyHigh={isOnlyHighSpeed}
          {...highSpeedCbs}
        />
        <Submit />
      </form>
      <CitySelector 
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector
        show={isDateSelectorVisible}
        {...dateSelectorCbs}
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
