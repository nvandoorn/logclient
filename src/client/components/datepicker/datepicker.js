import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import Calendar from './calendar/calendar'
import { Round as RoundBtn } from '../buttons/buttons'

import { monthContainer, container } from './datepicker.css'

const Month = props =>
  <div className={monthContainer}>
    <RoundBtn faName='arrow-left' onClick={props.prevMonth} />
    <div>{`${props.moment.format('MMM')} ${props.moment.year()}`}</div>
    <RoundBtn faName='arrow-right' onClick={props.nextMonth} />
  </div>

@autobind
class DatePicker extends Component {
  constructor (props) {
    super(props)
    this.state = { moment: this.props.moment }
  }
  setDate (date) {
    this.setState({ moment: this.state.moment.date(date) })
    this.onChange()
  }
  setMonth (month) {
    this.setState({ moment: this.state.moment.month(month) })
    this.onChange()
  }
  nextMonth () {
    this.setMonth(this.state.moment.month() + 1)
  }
  prevMonth () {
    this.setMonth(this.state.moment.month() - 1)
  }
  onChange () {
    this.props.onChange(this.state.moment)
  }
  render () {
    return (
      <div className={container}>
        <Month moment={this.state.moment} prevMonth={this.prevMonth} nextMonth={this.nextMonth} />
        <Calendar moment={this.state.moment} onClick={this.setDate} />
      </div>
    )
  }
}

export default DatePicker
