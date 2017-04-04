import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { container } from  './layout.css';

import Loglines from '../components/loglines/loglines';
import Controls from '../components/controls/controls';
import Sidebar from '../components/sidebar/sidebar';
import Config from '../components/config/config';
import { get, put, post } from '../helpers/http';

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
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={3}>
              <div className={container}>
                <Config folders={this.state.folders} show={!this.state.hasFolders}/>
                <Controls onChange={this.handleControlUpdate} values={this.state.params}/>
              </div>
              <div className={container}>
                Directory listing goes here
              </div>
            </Col>
            <Col sm={9}>
              <div className={container}>
                <Loglines loglines={this.state.loglines}/>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
