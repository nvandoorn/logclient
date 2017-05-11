import React from 'react'
import Calendar from './calendar/calendar'

import { Round as RoundBtn } from '../buttons/buttons'

import { monthContainer, container } from './datepicker.css'

const Month = props =>
  <div className={monthContainer}>
    <RoundBtn faName='arrow-left' onClick={() => { props.setMonth(props.moment.month() - 1) }} />
    <div>{`${props.moment.format('MMM')} ${props.moment.year()}`}</div>
    <RoundBtn faName='arrow-right' onClick={() => { props.setMonth(props.moment.month() + 1) }} />
  </div>

const DatePicker = props =>
  <div className={container}>
    <Month {...props} />
    <Calendar {...props} />
  </div>

export default DatePicker
