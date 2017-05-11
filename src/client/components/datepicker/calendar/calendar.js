import React from 'react'
import moment from 'moment'
import { range, chunk } from 'lodash'

import { day, prevMonth, nextMonth, daysOfWeek, table } from './calendar.css'

const DaysOfWeek = props =>
  <thead {...props}><tr>{ moment.weekdays().map((k, i) => <td key={i}>{k.slice(0, 3)}</td>) }</tr></thead>

const Day = ({i, className}) => <td className={`${day} ${className}`}>{i}</td>
const PrevMonthDay = ({i}) => <Day i={i} className={prevMonth} />
const NextMonthDay = ({i}) => <Day i={i} className={nextMonth} />

const rowify = days => chunk(days, 7).map(k => <tr>{k}</tr>)

function makeDayGrid (m) {
  // Details about this moment to generate grid
  const nDaysPrevMonth = m.clone().subtract(1, 'month').daysInMonth()
  const firstDayOfMonth = m.clone().startOf('month').weekday()
  const daysInMonth = m.daysInMonth()

  // Elements
  const prevMonthDays = range(firstDayOfMonth).reverse()
    .map(k => <PrevMonthDay key={`prev-${k}`} i={nDaysPrevMonth - k} />)
  const thisMonthDays = range(daysInMonth).map(k => <Day i={k + 1} key={k} className='' />)
  const nextMonthDays = range(7 - ((prevMonthDays.length + thisMonthDays.length) % 7))
    .map(k => <NextMonthDay key={`next-${k}`} i={k + 1} />)
  // Join and return in tbody
  return <tbody>{ rowify([].concat(prevMonthDays, thisMonthDays, nextMonthDays)) }</tbody>
}

const Calendar = props =>
  <div>
    <table className={table}>
      <DaysOfWeek className={daysOfWeek} />
      { makeDayGrid(moment('Jan 2017')) }
    </table>
  </div>

export default Calendar
