import React, { Component } from 'react'

const SidebarItem = ({name, isActive, onClick}) =>
  <li><a href='#' onClick={onClick} value={name}>{name}</a></li>

// TODO implement
class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.todo = 'implement this'
  }

  render () {
    return (
      <div>
        {this.props.logfiles.map(logfile => <SidebarItem key={logfile.value} {...logfile} />)}
      </div>
    )
  }
}

export default Sidebar
