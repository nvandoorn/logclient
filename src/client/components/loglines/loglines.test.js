/* eslint-env jest */

import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import Loglines from './loglines'

const props = [{
  text: `You must be pretty desperate if you're looking at the logs`,
  level: 2,
  levelStr: 'info',
  datetime: 1489387840000,
  datetimeStr: '6:50:40'
}]

it('should render correctly', () => {
  const loglines = renderer.create(<Loglines loglines={props} />).toJSON()
  expect(loglines).toMatchSnapshot()
})

it('should render without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Loglines loglines={props} />, div)
})
