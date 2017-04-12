import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { merge } from 'lodash/fp'
import { get } from '../helpers/http'

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../node_modules/spinkit/css/spinners/1-rotating-plane.css'
import { container } from './layout.css'

import Loglines from '../components/loglines/loglines'
import Controls from '../components/controls/controls'
import Sidebar from '../components/sidebar/sidebar'
import Config from '../components/config/config'

const MOCK_LOG_PATH = 'testlog.log'
const API_PORT = process.env.NODE_ENV === 'production' ? 3000 : 4000 // TODO this belongs in a .env
const BASE_URL = `//localhost:${API_PORT}/api/`
const FILE_URL = `${BASE_URL}file`
const DIR_URL = `${BASE_URL}directory`
const CONFIG_URL = `${BASE_URL}config`

const defaultState = {
  loglines: [],
  folders: [],
  hasFolders: false,
  ready: false
}

const defaultParmas = {
  logfile: MOCK_LOG_PATH, // TODO default to first item in directory
  page: 1,
  pagesize: '',
  startdt: '',
  enddt: ''
}

// TODO Better request handling -- likely Redux longterm
class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = defaultState
    this.params = defaultParmas
    const promises = [
      this.updateLoglines(),
      this.updateDirectory(),
      this.updateConfig()
    ]
    Promise.all(promises).then(() => { setTimeout(() => { this.setState({ ready: true }) }, 3 * 1000) })
  }

  query = (key, value) => {
    const params = {}
    params[key] = value
    this.params = merge(params, this.params)
    console.log(this.params)
    this.updateLoglines()
  }

  updateLoglines = () => new Promise((resolve, reject) =>{
    get(FILE_URL, this.params).then(resp => {
      this.setState({ loglines: resp.data })
      resolve()
    })
  })

  updateDirectory = () => new Promise((resolve, reject) => {
    get(DIR_URL, {}).then(resp => {
      this.setState({ files: resp.data })
      resolve()
    })
  })

  updateConfig = () => new Promise((resolve, reject) => {
    get(CONFIG_URL, {}).then(resp => {
      this.setState({ config: resp.data, hasFolders: resp.data.folders.length > 0 })
      resolve()
    })
  })

  render () {
    return (
      <div>
        { !this.state.ready ? <div className="sk-rotating-plane"></div> : null }
        { this.state.ready ?
        <Grid>
          <Row>
            <Col sm={3}>
              <div className={container}>
                <Config folders={this.state.config.folders} show={!this.state.hasFolders} />
                <Controls onChange={e => { this.query(e.id, e.value) }} values={this.params} />
              </div>
              <div className={container}>
                <Sidebar logfiles={this.state.files} onClick={e => { this.setState({ logfile: e }) }} />
              </div>
            </Col>
            <Col sm={9}>
              <div className={container}>
                <Loglines loglines={this.state.loglines} />
              </div>
            </Col>
          </Row>
        </Grid> : null }
      </div>
    )
  }
}

export default Layout
