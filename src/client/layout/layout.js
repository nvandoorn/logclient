import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { merge } from 'lodash/fp'

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { container } from './layout.css'

import Loglines from '../components/loglines/loglines'
import Controls from '../components/controls/controls'
import Sidebar from '../components/sidebar/sidebar'
import Config from '../components/config/config'

const MOCK_LOG_PATH = 'testlog.log'

// TODO Better request handling -- likely Redux longterm
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loglines: [],
      folders: [],
      hasFolders: false
    }
     // TODO this shit sucks
    this.handleControlUpdate = this.handleControlUpdate.bind(this)
    this.defaultQueryParams = this.defaultQueryParams.bind(this)
    this.setQueryParams = this.setQueryParams.bind(this)
    this.defaultQueryParams()
  }

  setQueryParams (params) {
    this.params = merge(params, this.params)
  }

  defaultQueryParams () {
    this.params = {
      logfile: MOCK_LOG_PATH, // TODO default to first item in directory
      page: 1,
      pagesize: '',
      startdt: '',
      enddt: ''
    }
  }

  handleControlUpdate (e) {
    console.log(e)
  }

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={3}>
              <div className={container}>
                <Config folders={this.state.folders} show={!this.state.hasFolders} />
                <Controls onChange={this.handleControlUpdate} values={this.state.params} />
              </div>
              <div className={container}>
                { this.state.files ? <Sidebar logfiles={this.state.files} onClick={e => { this.setState({ logfile: e }) }} /> : null }
              </div>
            </Col>
            <Col sm={9}>
              <div className={container}>
                <Loglines loglines={this.state.loglines} />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
