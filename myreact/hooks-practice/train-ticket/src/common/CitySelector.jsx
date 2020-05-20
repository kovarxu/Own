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

const AlbetChoose = memo((props) => {
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
})

/** 搜索条目组件 */
const SearchItem = memo((props) => {
  const { name, onClick } = props;

  return (
    <li onClick={() => onClick(name)} className="search-result-item">{name}</li>
  );
})

SearchItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

/** 搜索结果组件 */
const SearchResult = memo((props) => {
  const { searchKey, onClick } = props;
  const [result, setResult] = useState([]);
  // 延迟执行搜索
  const [_timer, _setTimer] = useState(null);

  // 输入搜索需要做防抖
  useEffect(() => {
    // abort请求标
    let aborted = false;

    _setTimer(setTimeout(() => {
      if (aborted) {
        return ;
      }
      fetch('/search?key=' + searchKey)
        .then(data => data.json())
        .then(data => {
          // 如果传回的键与查询的键不同，则不应该渲染
          if (data.length && data[0] === searchKey && !aborted) {
            setResult(data);
          }
        })
    }, 200))
    return () => {
      aborted = true;
      clearTimeout(_timer);
      _setTimer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey])

  const fallbackSearchResult = useMemo(() => (
    result.length ? result : [searchKey]
  ), [searchKey, result]);

  return (
    <ul className="search-result">
      {
        fallbackSearchResult.map(item => (
          <SearchItem
            key={item}
            name={item}
            onClick={onClick}
          />
        ))
      }
    </ul>
  )
})

SearchResult.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
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
      // 输入框有输入不渲染
      if (cleanCityText) {
        return null;
      }

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
  }, [isLoading, cityData, cleanCityText, handleChooseAlphaBet, onSelect])

  // 条件渲染搜索结果
  const renderSearchResult = useMemo(() => () => {
    if (cleanCityText) {
      return (
        <SearchResult 
          searchKey={cleanCityText}
          onClick={onSelect}
        />
      )
    }
    return null;
  }, [cleanCityText, onSelect])

  return (
    <div className={classnames('layer', { hidden: !show })}>
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

      <div className="search-result-wrapper">
        { renderSearchResult() }
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
