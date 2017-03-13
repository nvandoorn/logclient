import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Loglines from './loglines/loglines';
import Controls from './controls/controls';
import Sidebar from './sidebar/sidebar';
import Config from './config/config';
import { httpGetJson, httpPutJson } from './helpers/http';

const MOCK_LOG_DIR = 'debug_debug_livelog.log';
const BASE_URL = '//localhost:4000/api/';
const FILE_URL = `${BASE_URL}file`;
const DIR_URL = `${BASE_URL}directory`;
const DEFAULT_PAGE_SIZE = 50;

// TODO Better request handling -- likely Redux longterm
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loglines: [],
      params: {
        logfile: MOCK_LOG_DIR,
        page: 1,
        pagesize: DEFAULT_PAGE_SIZE,
        startline: '',
        endline: '',
        startdt: '',
        enddt: ''
      },
      folders: []
    };
    httpGetJson(`${BASE_URL}config`, {}).then(config => {
      this.setState({
        folders: config.data.folders,
        hasFolders: config.data.folders.length > 0
      });
      if(this.state.hasFolders){
        const promises = [
          httpGetJson(DIR_URL, {}),
          httpGetJson(FILE_URL, this.state.params)
        ];
        Promise.all(promises).then(values => {
          this.setState({
            files: values[0],
            loglines: values[1].logEntries
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
    httpGetJson(FILE_URL, this.state.params).then(data =>{
      this.setState({loglines: data.logEntries});
    });
  }

  render() {
    return (
      <div>
        <Config folders={this.state.folders} show={!this.state.hasFolders}/>
        { this.state.hasFolders > 0 ?
        <Grid>
          <Row>
            <Col sm={3}>
            </Col>
            <Col sm={9}>
              <Controls onChange={this.handleControlUpdate} values={this.state.params}/>
              <Loglines loglines={this.state.loglines}/>
            </Col>
          </Row>
        </Grid> : null }
      </div>
    );
  }
}

export default App;
