import React from 'react'
import createReactClass from 'create-react-class'
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'
import DatePicker from '../datepicker/datepicker'
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

const getLevelSelect = levelEnum => Object.keys(levelEnum).map(k => ({ value: levelEnum[k], label: k }))

const Controls = createReactClass({
  displayName: 'Controls',
  getInitialState: () => ({
    moment: moment(),
    showStartdt: false,
    showEnddt: false
  }),
  handleChange (e) {
    this.props.onChange(e.target)
  },
  toggleStartdt () {
    this.setState({ showStartdt: !this.state.showStartdt })
  },
  toggleEnddt () {
    this.setState({ showEnddt: !this.state.showEnddt })
  },
  render () {
    return (
      <div>
        <FormGroup>
          <ControlLabel style={{display: 'block'}}>Level</ControlLabel>
          <select id='level' onChange={this.handleChange} className={input} >
            { getLevelSelect(levels).map((k, i) => <option value={k.value} key={i}>{k.label}</option>) }
          </select>
        </FormGroup>
        <FieldGroup
          onChange={this.handleChange}
          id='pagesize'
          type='number'
          label='Page Size'
        />
        <button onClick={this.toggleStartdt}>Show me the dates Bob!</button>
        { this.state.showStartdt ? <DatePicker moment={this.state.moment} /> : null }
        <FieldGroup
          onChange={this.handleChange}
          id='enddt'
          type='text'
          label='End Date'
        />
      </div>
    )
  }
})

export default Controls
