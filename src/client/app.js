import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import style, { grid as gridStyle } from './app.css.js';

import Loglines from './loglines/loglines';
import Controls from './controls/controls';
import Sidebar from './sidebar/sidebar';
import Config from './config/config';
import http from '../server/test/lib/http';

import { get, put, post } from './helpers/http';

const MOCK_LOG_PATH = 'testlog.log';
const API_PORT = process.env.NODE_ENV === 'production' ? 3000 : 4000; // TODO this belongs in a .env
const BASE_URL = `//localhost:${API_PORT}/api/`;
const FILE_URL = `${BASE_URL}file`;
const DIR_URL = `${BASE_URL}directory`;

// TODO Better request handling -- likely Redux longterm
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loglines: [],
      params: {
        logfile: MOCK_LOG_PATH,
        page: 1,
        pagesize: '',
        startdt: '',
        enddt: ''
      },
      folders: [],
      hasFolders: false
    };
    get(`${BASE_URL}config`, {}).then(config => {
      this.setState({
        folders: config.data.folders,
        hasFolders: config.data.folders.length > 0
      });
      if(this.state.hasFolders){
        const promises = [
          get(DIR_URL, {}),
          get(FILE_URL, this.state.params)
        ];
        Promise.all(promises).then(values => {
          this.setState({
            files: values[0].data,
            loglines: values[1].data
          });
        });
      }
    });
    this.handleControlUpdate = this.handleControlUpdate.bind(this);
  }

  handleControlUpdate(e){
    const state = this.state;
    state.params[e.id] = e.value;
    this.setState(state);
    get(FILE_URL, this.state.params).then(data =>{
      this.setState({loglines: data.logEntries});
    });
  }

  render() {
    console.log(this.state.loglines)
    return (
      <div>
        <Config folders={this.state.folders} show={!this.state.hasFolders}/>
        { this.state.hasFolders > 0 ?
        <Grid className={gridStyle}>
          <Row>
            <Col sm={3}>
              <Controls onChange={this.handleControlUpdate} values={this.state.params}/>
            </Col>
            <Col sm={9}>
              <Loglines loglines={this.state.loglines}/>
            </Col>
          </Row>
        </Grid> : null }
      </div>
    );
  }
}

export default App;
