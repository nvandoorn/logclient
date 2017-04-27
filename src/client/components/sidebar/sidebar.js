import React, { Component } from 'react'

import { sidebarList } from './sidebar.css'

const SidebarItem = ({name, isActive, onClick, reqKey}) =>
  <li><a href='#' onClick={() => { onClick(reqKey) }} value={name}>{name}</a></li>

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (key) {
    this.props.onClick(key)
  }

  render () {
    return (
      <div>
        <ul className={sidebarList}>
          { this.props.logfiles.map(logfile => <SidebarItem key={logfile.key} reqKey={logfile.key} name={logfile.name} onClick={this.handleClick} />) }
        </ul>
      </div>
    )
  }
}

export default Sidebar
