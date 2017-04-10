import React, { Component } from 'react'

const SidebarItem = ({name, isActive, onClick}) =>
  <li><a href='#' onClick={() => { onClick(name) }} value={name}>{name}</a></li>

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (name) {
    this.props.onClick(name)
  }

  render () {
    return (
      <div>
        { this.props.logfiles.map(logfile => <SidebarItem key={logfile} name={logfile} onClick={this.handleClick} />) }
      </div>
    )
  }
}

export default Sidebar
