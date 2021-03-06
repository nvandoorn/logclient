import React from 'react'
import moment from 'moment'
import { range, chunk } from 'lodash'

import { day, prevMonth, nextMonth, daysOfWeek, table, active } from './calendar.css'

const DaysOfWeek = props =>
  <thead {...props}><tr>{ moment.weekdays().map((k, i) => <td key={i}>{k.slice(0, 3)}</td>) }</tr></thead>

const Day = ({i, classNames = [], onClick = () => {}}) =>
  <td className={`${day} ${classNames.join(' ')}`} onClick={() => { onClick(i) }}>{i}</td>

const rowify = days => chunk(days, 7).map((k, i) => <tr key={i}>{k}</tr>)
const oRange = n => range(1, n + 1) // offset range

function makeDayGrid (m, onClick) {
  // Details about this moment to generate grid
  const nDaysPrevMonth = m.clone().subtract(1, 'month').daysInMonth()
  // Enum where 0 is sunday
  const firstDayOfMonth = m.clone().startOf('month').weekday()
  const daysInMonth = m.daysInMonth()
  const selectedDay = m.date()

  // Elements
  const prevMonthDays = oRange(firstDayOfMonth).reverse()
    .map(k => <Day classNames={[prevMonth]} key={`prev-${k}`} i={nDaysPrevMonth - k} />)
  const thisMonthDays = oRange(daysInMonth).map(k => <Day onClick={onClick} i={k} key={k} classNames={k === selectedDay ? [active] : []} />)
  const nDaysNextMonth = 7 - ((prevMonthDays.length + thisMonthDays.length) % 7)
  const nextMonthDays = oRange(nDaysNextMonth < 7 ? nDaysNextMonth : 0)
    .map(k => <Day classNames={[nextMonth]} key={`next-${k}`} i={k} />)

  // Join and return in tbody
  return <tbody>{ rowify([].concat(prevMonthDays, thisMonthDays, nextMonthDays)) }</tbody>
}

const Calendar = props =>
  <table className={table}>
    <DaysOfWeek className={daysOfWeek} />
    { makeDayGrid(props.moment, props.onClick) }
  </table>

export default Calendar
