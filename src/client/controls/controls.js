import React, { Component }from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

const COL_SIZE = 2;

const FieldGroup = ({onChange, id, label, help, ...props }) =>
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} onChange={onChange}/>
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>

// TODO convert to a class with state
class Controls extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    this.props.onChange(e.target);
  }

  render(){
    const values = this.props.values;
    return(
      <div>
        <FieldGroup
          onChange={this.handleChange}
          id="pagesize"
          type="number"
          label="Page Size"
          value={values.pagesize}
        />
        <FieldGroup
          onChange={this.handleChange}
          id="startline"
          type="number"
          label="Start Line"
          value={values.startline}
        />
        <FieldGroup
          onChange={this.handleChange}
          id="endline"
          type="number"
          label="End Line"
          value={values.endline}
        />
        <FieldGroup
          onChange={this.handleChange}
          id="startdt"
          type="text"
          label="Start Date"
          values={values.startdt}
        />
        <FieldGroup
          onChange={this.handleChange}
          id="enddt"
          type="text"
          label="End Date"
          values={values.enddt}
        />
      </div>
    )
  }
}

export default Controls;
