import React from 'react'
import createReactClass from 'create-react-class'
import { Modal as BModal, Button } from 'react-bootstrap'

const Modal = createReactClass({
  getInitialState: () => ({ showModal: this.props.show }),
  close () {
    this.setState({ showModal: false })
  },
  open () {
    this.setState({ showModal: true })
  },
  componentWillReceiveProps () {
    this.setState({ showModal: this.props.state })
  },
  render () {
    return (
      <div>
        <Button bsStyle='primary' bsSize='small' onClick={this.open}>
          Config
        </Button>
        <BModal show={this.state.showModal} onHide={this.close}>
          <BModal.Body>
            {this.props.children}
          </BModal.Body>
        </BModal>
      </div>
    )
  }
})

export default Modal
