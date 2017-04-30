import createReactClass from 'create-react-class'
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Q from 'q'
import Spinner from 'react-spinkit'
import { merge } from 'lodash/fp'
import { get as axiosGet, post, put } from 'axios' // eslint-disable-line
import { getJoinedRoutes } from '../../helpers'

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { container, spinner } from './layout.css'

import Loglines from '../components/loglines/loglines'
import Controls from '../components/controls/controls'
import Sidebar from '../components/sidebar/sidebar'
import Config from '../components/config/config'

const get = (route, params) => axiosGet(route, { params: params })

// TODO better way to determine API url
const HOST = process.env.NODE_ENV === 'production' ? window.location.host : `${window.location.hostname}:4000`
const BASE_URL = `//${HOST}/api`
const joinedRoutes = getJoinedRoutes(BASE_URL)

const defaultState = {
  loglines: [],
  folders: [],
  hasFolders: false,
  ready: false,
  loading: false
}

const Layout = createReactClass({
  params: { key: 0 },
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
    return this.updateState(joinedRoutes.file, 'loglines', params)
  },

  updateDirectory () {
    return this.updateState(joinedRoutes.directories, 'files', {})
  },

  updateConfig () {
    return this.updateState(joinedRoutes.config, 'config', {})
  },

  updateState (route, stateKey, params) {
    this.setState({ loading: true })
    return new Promise((resolve, reject) => {
      get(route, params).then(resp => {
        if (resp.data.success) {
          this.setState({ [stateKey]: resp.data.data, loading: false })
          resolve(resp)
        } else {
          this.setState({ loading: false })
          reject(new Error(resp.msg))
        }
      })
      .catch(err => {
        this.setState({ loading: false })
        reject(err)
      })
    })
  },

  render () {
    return (
      <div>
        { !this.state.ready ? <Spinner spinnerName='rotating-plane' noFadeIn /> : null }
        { this.state.ready
        ? <Grid>
          <Row>
            <Col sm={3}>
              <div className={container}>
                <Config folders={this.state.config.directories} show={!this.state.config.directories} />
                <Controls onChange={e => { this.query(e.id, e.value) }} values={this.params} />
              </div>
              <div className={container}>
                <Sidebar logfiles={this.state.files} onClick={e => { this.query('key', e) }} />
              </div>
            </Col>
            <Col sm={9}>
              <div className={container}>
                { this.state.loading ? <Spinner spinnerName='circle' className={spinner} noFadeIn /> : null }
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
