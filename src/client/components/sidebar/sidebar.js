import React, { Component } from 'react'

const SidebarItem = ({name, value, isActive, onClick}) =>
  <li><a href='#' onClick={onClick} value={value}>{name}</a></li>
// TODO implement
class Sidebar extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        {this.props.logFiles.map(logFile => <SidebarItem key={logFile.value}{...logFile} />)}
      </div>
    )
  }
}

export default Sidebar
