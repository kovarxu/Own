import React, { memo, useMemo, useCallback } from 'react';
import classnames from 'classnames';
import Proptypes from 'prop-types';
import './SelLayer.css';

const ToggleItem = memo((props) => {
  const { name, checked, index, onToggle } = props;
  
  return (
    <div 
      className={classnames('item-cell', { checked: checked })}
      onClick={() => onToggle(index)}
    >{name}</div>
  );
});

ToggleItem.propTypes = {
  name: Proptypes.string.isRequired,
  checked: Proptypes.bool.isRequired,
  index: Proptypes.number.isRequired,
  onToggle: Proptypes.func.isRequired
}
 
const SelLayer = memo((props) => {
  const { 
    isShown,
    aviableSeatItems,
    checkedIndices,
    isQueryingItems,
    setCheckedIndices,
    hide
  } = props;

  const handleClickItem = useCallback((index) => {
    const id = checkedIndices.indexOf(index);
    if (id >= 0) {
      setCheckedIndices([...checkedIndices].filter((_, index) => index !== id));
    } else {
      setCheckedIndices([...checkedIndices, index]);
    }
  }, [checkedIndices, setCheckedIndices]);

  const freshCheckedIndices = useCallback(() => {
    setCheckedIndices([]);
  }, [setCheckedIndices]);

  const onSave = () => {

  }

  const renderSeats = useMemo(() => () => {
    if (isQueryingItems) {
      return <div>Loading...</div>
    }
    if (aviableSeatItems) {
      return (
        <>
          <div className="items-wrapper">
            {
              aviableSeatItems.map((item, index) => {
                return (
                    <ToggleItem
                      key={item}
                      name={item}
                      checked={checkedIndices.includes(index)}
                      index={index}
                      onToggle={handleClickItem}
                    />
                    )
              })
            }
          </div>
          <div className="btn-wrapper">
            <div className="btn" onClick={freshCheckedIndices}>清空</div>
            <div className="btn" onClick={onSave}>保存</div>
          </div>
        </>
      );
    }
    return <div>Error happened</div>
  }, [checkedIndices, isQueryingItems, aviableSeatItems]);

  return (
    <div 
      className={classnames('sel-layer', 'layer', { hidden: !isShown })}
    >
      <button onClick={hide}>hideLayer</button>
      {
        renderSeats()
      }
    </div>
  );
});

SelLayer.propTypes = {
  isShown: Proptypes.bool.isRequired,
  aviableSeatItems: Proptypes.array.isRequired,
  checkedIndices: Proptypes.array.isRequired,
  isQueryingItems: Proptypes.bool.isRequired,
  setCheckedIndices: Proptypes.func.isRequired,
  hide: Proptypes.func.isRequired
}
 
export default SelLayer;
