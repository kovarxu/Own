import React, { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback,
  memo 
} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './CitySelector.css';

/** 每一个城市选择项 */
const CityItem = memo((props) => {
  const { name, onSelect } = props;

  return (
    <li className="city-item" onClick={e => onSelect(e.target.innerHTML)}>{name}</li>
  );
})

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func
}

/** 每个字母开头的项的集合 */
const CityChunk = memo((props) => {
  const { title, citys=[], onSelect } = props;

  return (
    <ul className="city-chunk" data-cate={title}>
      <li className="city-title">{title}</li>
      {
        citys && citys.map(city => (
          <CityItem 
            name={city.name} 
            key={city.name} 
            onSelect={onSelect}
          />
        ))
      }
    </ul>
  );
})

CityChunk.propTypes = {
  title: PropTypes.string.isRequired,
  citys: PropTypes.array,
  onSelect: PropTypes.func
}

/** 整个列表 */
const WholeCityList = memo((props) => {
  const { cityList, onSelect } = props;

  if (cityList) {
    return (
      <div className="city-list-wrapper">
        {
          cityList.map(chunk => (
            <CityChunk 
              {...chunk} 
              key={chunk.title}
              onSelect={onSelect}
            />
          ))
        }
      </div>
    );
  }
})

WholeCityList.propTypes = {
  cityList: PropTypes.array.isRequired,
  onSelect: PropTypes.func
}

/** 字母表选择组件 */
const alphaBets = Array.from({ length: 26 }, (_, index) => String.fromCharCode(index + 65));

const AlbetChoose = (props) => {
  const { onClick } = props;

  return (
    <ul className="alphabet">
      {
        alphaBets.map(alpha => (
          <li 
            key={alpha}
            onClick={() => onClick(alpha)}
          >{alpha}</li>
        ))
      }
    </ul>
  );
}

/** 城市选择器组件 */
const CitySelector = memo((props) => {
  const {
    show,
    cityData,
    isLoading,
    onBack,
    fetchCityData,
    onSelect
  } = props;

  const [cityText, setCityText] = useState('');
  const cleanCityText = useMemo(() => cityText.trim(), [cityText])

  // 异步请求数据
  useEffect(() => {
    if (!show || isLoading || cityData) {
      return;
    }
    fetchCityData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  // 点击字母表跳转
  const handleChooseAlphaBet = useCallback((sel) => {
    document.querySelector(`[data-cate=${sel}]`).scrollIntoView();
  }, [])

  // 条件渲染函数
  // 把这个用use包起来看看呢
  const renderCityList = useMemo(() => () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (cityData) {
      return (
        <>
          <WholeCityList 
            cityList={cityData.cityList} 
            onSelect={onSelect}
          />
          <AlbetChoose onClick={handleChooseAlphaBet} />
        </>
      );
    }
  
    return <div>Error in loading the city list.</div>;
  }, [isLoading, cityData])

  return (
    <div className={classnames('city-selector-wrapper', { hidden: !show })}>
      <div className="search-wrapper">
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
        <div className="search-input">
          <input 
            type="text"
            value={cityText}
            onChange={e => setCityText(e.target.value)}
            placeholder="请输入要查询的城市名称"
          />
          <span 
            className={classnames('search-clean-icon', { hidden: !cleanCityText })}
            onClick={() => setCityText('')}
          >x</span>
        </div>
      </div>

      <div className="city-wrapper">
        { renderCityList() }
      </div>
    </div>
  );
})

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired
}
 
export default CitySelector;
