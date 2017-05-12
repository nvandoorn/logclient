import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'
import DatePicker from '../datepicker/datepicker'
import moment from 'moment'

import { levels } from '../../../constants'

import { input } from './controls.css'

const FieldGroup = ({onChange, id, label, help, ...props }) => // eslint-disable-line
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} onChange={onChange} className={input} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>

const getLevelSelect = levelEnum => Object.keys(levelEnum).map(k => ({ value: levelEnum[k], label: k }))

@autobind
class Controls extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startMoment: moment(),
      endMoment: moment(),
      showStartdt: true,
      showEnddt: false
    }
  }
  handleChange (e) {
    this.props.onChange(e.target)
  }
  toggleStartdt () {
    // TODO put this back
    // this.setState({ showStartdt: !this.state.showStartdt })
  }
  toggleEnddt () {
    this.setState({ showEnddt: !this.state.showEnddt })
  }
  updateStartMoment (moment) {
    this.setState({ startMoment: moment })
  }
  updateEndMoment (moment) {
    this.setState({ endMoment: moment })
  }

  render () {
    return (
      <div>
        <FormGroup>
          <ControlLabel style={{display: 'block'}}>Level</ControlLabel>
          <select id='level' onChange={this.handleChange} className={input} >
            { getLevelSelect(levels).reverse().map((k, i) => <option value={k.value} key={i}>{k.label}</option>) }
          </select>
        </FormGroup>
        <FieldGroup
          onChange={this.handleChange}
          id='pagesize'
          type='number'
          label='Page Size'
        />
        <FieldGroup
          onFocus={this.toggleStartdt}
          onBlur={this.toggleStartdt}
          type='text'
          label='Start Date'
          value={this.state.startMoment._d}
          readOnly
        />
        { this.state.showStartdt ? <DatePicker moment={this.state.startMoment} onChange={this.updateStartMoment}/> : null }
        <FieldGroup
          onFocus={this.toggleEnddt}
          onBlur={this.toggleEnddt}
          type='text'
          label='End Date'
          readOnly
        />
        { this.state.showEnddt ? <DatePicker moment={this.state.endMoment} onChange={this.updateEndMoment}/> : null }
      </div>
    )
  }
}

export default Controls
