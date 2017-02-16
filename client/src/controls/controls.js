import React from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

const COL_SIZE = 2;

const createFieldGroups = onChange =>
  ({ id, label, help, ...props }) =>
    <Col sm={COL_SIZE}>
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} onChange={onChange}/>
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    </Col>;

// TODO convert to a class with state
function Controls({onChange, values}){
  const FieldGroup = createFieldGroups(onChange);
  return(
        <Row>
          <FieldGroup
            id="pagesize"
            type="number"
            label="Page Size"
            value={values.pagesize}
          />
          <FieldGroup
            id="startline"
            type="number"
            label="Start Line"
            value={values.startline}
          />
          <FieldGroup
            id="endline"
            type="number"
            label="End Line"
            value={values.endline}
          />
          <FieldGroup
            id="startdt"
            type="text"
            label="Start Date"
            values={values.startdt}
          />
          <FieldGroup
            id="enddt"
            type="text"
            label="End Date"
            values={values.enddt}
          />
        </Row>
  )
}

export default Controls;