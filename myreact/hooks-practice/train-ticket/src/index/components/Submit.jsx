import React, { memo } from 'react';
import './Submit.css';

const Submit = memo((props) => {
  return (
    <div className="search-btn-wrapper">
      <button type="submit" className="search-btn">搜索</button>
    </div>
  );
})
 
export default Submit;
