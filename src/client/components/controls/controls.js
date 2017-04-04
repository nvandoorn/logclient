import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

import { input } from './controls.css'

const FieldGroup = ({onChange, id, label, help, ...props }) => // eslint-disable-line
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} onChange={onChange} className={input} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>

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
