import createReactClass from 'create-react-class'
import React from 'react'

import { open, closed, collapse } from './collapse.css'

const Collapse = createReactClass({
  displayName: 'Collapse',
  getInitialState: () => ({ open: false }),
  toggle () {
    this.setState({ open: !this.state.open })
  },
  render () {
    const className = `${collapse} ${this.state.open ? open : closed}`
    return (
      <div>
        <div onClick={this.toggle}>{ this.props.trigger }</div>
        <div className={className} style={this.props.cStyle}>hi</div>
      </div>
    )
  }
})

export default Collapse
