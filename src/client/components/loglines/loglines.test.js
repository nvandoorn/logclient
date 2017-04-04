/* eslint-env jest */

import React from 'react'
import ReactDOM from 'react-dom'

import Loglines from './loglines'

it('should render without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.rendere(<Loglines />, div)
})
