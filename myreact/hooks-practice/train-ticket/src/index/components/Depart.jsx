import React, { 
  useMemo
} from 'react';
import { h0 } from 'src/common/util';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import './Depart.css';

// 本组件使用了new Date即当前日期，所以不进行memo包裹优化
const Depart = (props) => {
  const {
    departDate,
    showDeteSelector
  } = props;

  const h0Date = h0(departDate);
  const displayedDate = useMemo(() => (
    dayjs(new Date(h0Date)).format('YYYY-MM-DD')
  ), [h0Date])

  const dayInfo = useMemo(() => 
    ['天', '一', '二', '三', '四', '五', '六'][new Date(h0Date).getDay()], 
    [h0Date])
  
  const isToday = useMemo(() => h0Date === h0(new Date()), [h0Date]);

  return (
    <div className="depart-container" onClick={showDeteSelector}>
      <input
        type="hidden"
        name="depart"
        value={displayedDate}
      />
      <div className="depart-date">{displayedDate}</div>
      <div className='depart-day'>周{dayInfo}</div>
      <div className='depart-note'>{isToday && '(今天)'}</div>
    </div>
  );
}

Depart.propTypes = {
  departDate: function (props, propName, componentName) {
    const value = props[propName];
    if (value !== null && !(value instanceof Date)) {
      return new Error(`departDate must be of type null or Date, got ${value}`);
    }
  },
  showDeteSelector: PropTypes.func.isRequired
}
 
export default Depart;
