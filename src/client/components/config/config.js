import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Modal from '../modal/modal';
import { modal } from './config.css.js'

const ConfigFolder = ({name, directory}) =>
  <form>
    <FormGroup>
      <ControlLabel>Log Folder Name</ControlLabel>
      <FormControl
        type="text"
        value={name||''}
        placeholder="My Server Logs"
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Log Folder Path</ControlLabel>
      <FormControl
        type="text"
        value={directory||''}
        placeholder="/var/log/"
      />
    </FormGroup>
  </form>


class Config extends Component{
  render(){
    return(
      <div>
        <Modal show={this.props.show} className={modal}>
          {this.props.folders.map(folder => <ConfigFolder {...folder} key={folder.directory}/>)}
        </Modal>
      </div>
    )
  }
}

export default Config;
