import React from 'react';
import './Journey.css';

const Journey = (props) => {
  const {
    from,
    to,
    exchangeToFrom,
    showCitySelector
  } = props;

  return (
    <div className="journey-container">
      <div className="journey-city">
        <input 
          type="text"  
          onClick={() => showCitySelector(true)}
          readOnly
          name="from"
          value={from}
        />
      </div>

      <div 
        className="iconfont exchange-icon"
        onClick={exchangeToFrom}
      ></div>

      <div className="journey-city">
        <input 
          type="text"  
          onClick={() => showCitySelector(false)}
          readOnly
          name="to"
          value={to}
        />
      </div>
    </div>
  );
}
 
export default Journey;
