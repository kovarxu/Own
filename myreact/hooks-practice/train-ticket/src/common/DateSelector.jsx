import React, {
  useMemo,
  memo
} from 'react';
import Header from 'src/common/Header';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './DateSelector.css';

/** 日历格子组件 */
const CalendarCell = memo((props) => {
  const { 
    name,
    timestamp,
    onSelect 
  } = props;
  const cellClass = name === '' ? 'blank' : name === '今天' ? 'today' : name[0] === '-' ? 'before' : 'behind';
  const dispCellName = name.match(/^[-+]/) ? name.slice(1) : name;

  const onClick = () => {
    if (name === '' || name[0] === '-') {
      return ;
    }
    onSelect(new Date(timestamp));
  }

  return (
    <td 
      className={classnames('cell', cellClass)} 
      onClick={onClick}
    >{dispCellName}</td>
  )
})

CalendarCell.propTypes = {
  name: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  onSelect: PropTypes.func.isRequired
}

/** 月份组件 */
const days = ['一', '二', '三', '四', '五', '六', '日'];
const MonthCalendar = memo((props) => {
  const { 
    monthMap: {
      year,
      month,
      rows
    }, 
    onSelect 
  } = props;

  return (
    <table className="calendar-table">
      <caption>{year}年{month}月</caption>
      <thead>
        <tr>
          {
            days.map(day => (
              <td key={day} className="td-cell">{'周' + day}</td>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          rows.map((row, index) => {
            return (
              <tr key={index}>
                {
                  row.map((item, index2) => (
                    <CalendarCell
                      name={item.text}
                      timestamp={item.timestamp}
                      onSelect={onSelect}
                      key={`${index}_${index2}`}
                    />
                  ))
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
})

MonthCalendar.propTypes = {
  monthMap: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.number
    })))
  }),
  onSelect: PropTypes.func.isRequired
}

// 有使用Date.now，不适用memo
const DateSelector = (props) => {
  const {
    show,
    onSelect,
    onBack
  } = props;

  const listMap = useMemo(() => generateThreeMonthMap(Date.now()), []);

  return (
    <div className={classnames('layer', { hidden: !show })}>
      <Header title="日期选择" onBack={onBack} />
      <div className="calendar-wrapper">
        {
          listMap.map(monthMap => (
            <MonthCalendar
              monthMap={monthMap}
              onSelect={onSelect}
              key={monthMap.month}
            />
          ))
        }
      </div>
    </div>
  );
}

DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
}

function generateMonthMap (timestamp, needToday) {
  // 1. 得到今天的年月日星期，生成rows第一行，填补为空的数据
  let timeDate = new Date(timestamp);
  const year = timeDate.getFullYear();
  const month = timeDate.getMonth() + 1;
  // 保留今天
  const date = timeDate.getDate(); 

  // 置为1号
  timeDate.setDate(1);
  const firstDay = timeDate.getDay();

  const monthMap = {
    year,
    month,
    rows: []
  }

  let currentRow = [];
  monthMap.rows.push(currentRow);
  for (let i = 1; i < firstDay; i++) {
    currentRow.push({ text: '' })
  }
  // 以-开头表示在当前日期之前
  const dateText = needToday ? date === 1 ? '今天' : '-1' : '+1';
  currentRow.push({ text: dateText, timestamp: timeDate.getTime() });

  // 2. 在今天的基础上新增一天，如果是周一，需要新增加row；如果年或月增加了，则退出循环
  while (true) {
    timeDate.setDate(timeDate.getDate() + 1);
    const day = timeDate.getDay();
    const stepDate = timeDate.getDate();

    if (timeDate.getMonth() + 1 !== month) {
      break;
    }

    if (day === 1) {
      monthMap.rows.push(currentRow = []);
    }

    const dateText = 
      needToday ?
        stepDate < date ?
          '-' + stepDate :
          stepDate === date ?
            '今天' :
            '+' + stepDate :
        '+' + stepDate;

    currentRow.push({ text: dateText, timestamp: timeDate.getTime() });
  }

  // 3. 补上剩余的天
  while (currentRow.length < 7) {
    currentRow.push({ text: '' });
  }

  return { monthMap, timestamp: timeDate.getTime() };
}

function generateThreeMonthMap (nowstamp) {
  const listMap = [];
  for (let i = 0; i < 3; i++) {
    let { monthMap, timestamp } = generateMonthMap(nowstamp, i === 0 ? true : false);
    listMap.push(monthMap);
    nowstamp = timestamp;
  }
  return listMap;
}
 
export default DateSelector;
