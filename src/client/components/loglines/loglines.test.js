/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import Loglines from './loglines'

it('renders correctly', () => {
  const props = [{
    text: `You must be pretty desperate if you're looking at the logs`,
    level: 2,
    levelStr: 'info',
    datetime: 1489387840000,
    datetimeStr: '6:50:40'
  }]
  const loglines = renderer.create(<Loglines loglines={props} />).toJSON()
  expect(loglines).toMatchSnapshot()
})
