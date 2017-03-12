import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Loglines from './loglines/loglines';
import Controls from './controls/controls';
import Sidebar from './sidebar/sidebar';

const MOCK_LOG_DIR = '/var/log/clientlog/debug_debug_livelog.log';
const BASE_URL = 'http://localhost:4000/api/file';
const DEFAULT_PAGE_SIZE = 50;

const joinUrlParams = (url, params) => `${url}?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`;

// TODO handle failure case
function httpGetJson(url, params){
  return new Promise((resolve, reject) => {
    const route = joinUrlParams(url, params);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', route);
    xhr.send();
    xhr.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        resolve(data);
      }
    };
  });
}

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
      }
    };
    this.handleControlUpdate = this.handleControlUpdate.bind(this);
  }

  handleControlUpdate(e){
    const state = this.state;
    state.params[e.id] = e.value;
    this.setState(state);
    httpGetJson(BASE_URL, this.state.params).then(data =>{
      this.setState({loglines: data.logEntries});
    });
    console.log(this.state);
  }

  render() {
    const logFiles = [{name:'hi', value:'nice', isActive: false, onClick:()=>{} }];
    return (
      <Grid>
        <Row>
          <Col sm={3}>
            <Sidebar logFiles={logFiles}/>
          </Col>
          <Col sm={9}>
            <Controls onChange={this.handleControlUpdate} values={this.state.params}/>
            <Loglines loglines={this.state.loglines}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
