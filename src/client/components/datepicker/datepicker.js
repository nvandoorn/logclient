import React from 'react'
import Calendar from './calendar/calendar'

import { datePicker } from './datepicker.css'

const DatePicker = props =>
  <div className={datePicker}>
    <Calendar />
  </div>

export default DatePicker
