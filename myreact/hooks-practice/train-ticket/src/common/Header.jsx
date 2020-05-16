import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = (props) => {
  const { onBack, title } = props;

  return (
    <div className="header">
      <div onClick={onBack} className="back-btn">
        <svg width="42" height="42">
          <polyline
            points="25,13 16,21 25,29"
            stroke="#fff"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      <h3 className="header-title">{ title }</h3>
    </div>
  );
}

Header.propTypes = {
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}
 
export default Header;
