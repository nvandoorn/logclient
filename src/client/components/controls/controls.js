import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl, HelpBlock, OverlayTrigger, Popover } from 'react-bootstrap'
import InputMoment from 'input-moment' // eslint-disable-line
import moment from 'moment'

import { levels } from '../../../constants'

import '../../../../node_modules/input-moment/dist/input-moment.css'
import { input } from './controls.css'

const FieldGroup = ({onChange, id, label, help, ...props }) => // eslint-disable-line
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} onChange={onChange} className={input} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>

function DatePicker (props) {
  const pickerPopover = (
    <Popover title='Select Date and Time'>
      <InputMoment moment={props.moment} />
    </Popover>
  )
  return (
    <OverlayTrigger trigger='click' placement='right' overlay={pickerPopover}>
      <FieldGroup {...props} />
    </OverlayTrigger>
  )
}

const getLevelSelect = levelEnum => Object.keys(levelEnum).map(k => ({ value: levelEnum[k], label: k }))

class Controls extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = { moment: moment() }
  }

  handleChange (e) {
    this.props.onChange(e.target)
  }

  render () {
    return (
      <div>
        <FormGroup>
          <ControlLabel style={{display: 'block'}}>Level</ControlLabel>
          <select id='level' onChange={this.handleChange} className={input} >
            { getLevelSelect(levels).map(k => <option value={k.value}>{k.label}</option>) }
          </select>
        </FormGroup>
        <FieldGroup
          onChange={this.handleChange}
          id='pagesize'
          type='number'
          label='Page Size'
        />
        <DatePicker
          moment={this.state.moment}
          onChange={this.handleChange}
          id='startdt'
          type='text'
          label='Start Date'
        />
        <FieldGroup
          onChange={this.handleChange}
          id='enddt'
          type='text'
          label='End Date'
        />
      </div>
    )
  }
}

export default Controls
