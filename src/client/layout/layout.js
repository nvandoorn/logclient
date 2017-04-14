import createReactClass from 'create-react-class'
import React from 'react'
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

const defaultParams = {
  logfile: MOCK_LOG_PATH, // TODO default to first item in directory
  page: 1,
  pagesize: '',
  startdt: '',
  enddt: ''
}

// TODO Better request handling -- likely Redux longterm
const Layout = createReactClass({
  params: defaultParams,
  getInitialState: () => defaultState,
  componentWillMount () {
    const promises = [
      this.updateLoglines(this.params),
      this.updateDirectory(),
      this.updateConfig()
    ]
    // TODO remove timer (used to mock out load spinner)
    Promise.all(promises).then(() => { setTimeout(() => { this.setState({ ready: true }) }, 3 * 1000) })
  },

  query (key, value) {
    this.params = merge(this.params, { [key]: value })
    console.log(this.params)
    this.updateLoglines(this.params)
  },

  updateLoglines (params) {
    return this.updateState(FILE_URL, 'loglines', params)
  },

  updateDirectory () {
    return this.updateState(DIR_URL, 'files', {})
  },

  updateConfig () {
    return this.updateState(CONFIG_URL, 'config', {})
  },

  updateState (route, stateKey, params) {
    return new Promise((resolve, reject) => {
      get(route, params).then(resp => {
        if (resp.success) {
          this.setState({ [stateKey]: resp.data })
          resolve()
        } else {
          reject(new Error(resp.msg))
        }
      })
      .catch(err => { reject(err) })
    })
  },

  render () {
    return (
      <div>
        { !this.state.ready ? <div className='sk-rotating-plane' /> : null }
        { this.state.ready
        ? <Grid>
          <Row>
            <Col sm={3}>
              <div className={container}>
                <Config folders={this.state.config.folders} show={!this.state.config.folders.length} />
                <Controls onChange={e => { this.query(e.id, e.value) }} values={this.params} />
              </div>
              <div className={container}>
                <Sidebar logfiles={this.state.files} onClick={e => { this.query('logfile', e) }} />
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
})

export default Layout
