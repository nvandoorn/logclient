import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

import { levels } from '../../../constants'

import { input } from './controls.css'
import '../../../../node_modules/react-select/dist/react-select.css'

const FieldGroup = ({onChange, id, label, help, ...props }) => // eslint-disable-line
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} onChange={onChange} className={input} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>

const getLevelSelect = levelEnum => Object.keys(levelEnum).map(k => ({ value: levelEnum[k], label: k }))

class Controls extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onChange(e.target)
  }

  render () {
    const values = this.props.values
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
          value={values.pagesize}
        />
        <FieldGroup
          onChange={this.handleChange}
          id='startdt'
          type='text'
          label='Start Date'
          values={values.startdt}
        />
        <FieldGroup
          onChange={this.handleChange}
          id='enddt'
          type='text'
          label='End Date'
          values={values.enddt}
        />
      </div>
    )
  }
}

export default Controls
