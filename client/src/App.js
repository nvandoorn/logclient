import React, { Component } from 'react';

import Loglines from './loglines/loglines';

import './app.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loglines: []
    };
    const xhr = new XMLHttpRequest();
    const route = `http://localhost:4000/logs/api/debug_debug_livelog.log/1`;
    xhr.open('GET', route);
    xhr.send();
    const self = this;
    xhr.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        self.setState({loglines: data.logEntries});
      }
    };
  }

  render() {
    return (
      <Loglines loglines={this.state.loglines}/>
    );
  }
}

export default App;
