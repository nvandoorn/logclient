import React, { Component } from 'react'

const SidebarItem = ({name, isActive, onClick, key}) =>
  <li><a href='#' onClick={() => { onClick(key) }} value={name}>{name}</a></li>

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
        { this.props.logfiles.map(logfile => <SidebarItem key={logfile.key} name={logfile.name} onClick={this.handleClick} />) }
      </div>
    )
  }
}

export default Sidebar
