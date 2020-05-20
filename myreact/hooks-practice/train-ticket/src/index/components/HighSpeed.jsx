import React, { memo } from 'react';
import './HighSpeed.css';

const HighSpeed = memo((props) => {
  const { onlyHigh, onToggle } = props;
  
  return (
    <div className="high-speed">
      <div className="high-speed-text">只看高铁/动车</div>
      <input 
        className="high-speed-toggler"
        type="checkbox" 
        name="onlyHigh" 
        value={onlyHigh} 
        onClick={onToggle}
      />
    </div>
  );
})

export default HighSpeed;
