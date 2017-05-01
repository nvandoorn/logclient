import React, { Component } from 'react'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Modal from '../modal/modal'

const ConfigDir = ({name, path}) =>
  <form>
    <FormGroup>
      <ControlLabel>Log Folder Name</ControlLabel>
      <FormControl
        type='text'
        value={name || ''}
        placeholder='My Server Logs'
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Log Folder Path</ControlLabel>
      <FormControl
        type='text'
        value={path || ''}
        placeholder='/var/log/'
      />
    </FormGroup>
  </form>

class Config extends Component {
  render () {
    console.log(this.props)
    return (
      <div>
        <Modal show={this.props.show}>
          {this.props.directories.map(dir => <ConfigDir {...dir} key={dir.path} />)}
        </Modal>
      </div>
    )
  }
}

export default Config
