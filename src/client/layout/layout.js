import createReactClass from 'create-react-class'
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Q from 'q'
import { merge } from 'lodash/fp'
import { get } from '../helpers/http'

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../node_modules/spinkit/css/spinners/1-rotating-plane.css'
import { container } from './layout.css'

import Loglines from '../components/loglines/loglines'
import Controls from '../components/controls/controls'
import Sidebar from '../components/sidebar/sidebar'
import Config from '../components/config/config'

// TODO better way to determine API url
const HOST = process.env.NODE_ENV === 'production' ? window.location.host : `${window.location.hostname}:4000`
const BASE_URL = `//${HOST}/api/`
const FILE_URL = `${BASE_URL}file`
const DIR_URL = `${BASE_URL}directory`
const CONFIG_URL = `${BASE_URL}config`

const defaultState = {
  loglines: [],
  folders: [],
  hasFolders: false,
  ready: false,
  loading: false
}

const defaultParams = {
  logfile: '',
  page: 1,
  pagesize: '',
  startdt: '',
  enddt: ''
}

const Layout = createReactClass({
  params: defaultParams,
  getInitialState: () => defaultState,

  componentWillMount () {
    Q.fcall(this.updateConfig)
    .then(this.updateDirectory)
    .then(resp => {
      this.setParams('logfile', resp.data[0])
    })
    .then(() => this.updateLoglines(this.params))
    .done(() => { setTimeout(() => { this.setState({ ready: true }) }, 1000) })
  },

  query (key, value) {
    this.updateLoglines(this.setParams(key, value))
  },

  setParams (key, value) {
    this.params = merge(this.params, { [key]: value })
    return this.params
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
    this.setState({ loading: true })
    return new Promise((resolve, reject) => {
      get(route, params).then(resp => {
        if (resp.success) {
          this.setState({ [stateKey]: resp.data, loading: false })
          resolve(resp)
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
        { !this.state.ready || this.state.loading ? <div className='sk-rotating-plane' /> : null }
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
