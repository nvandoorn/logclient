import React from 'react'

import { loglines as loglinesStyle } from './loglines.css'

import Line from './line/line'

let i = 0
let getKey = () => `line-${i++}` // TODO dejank this
const createLines = loglines => loglines.map(logline => <Line props={logline} key={getKey()} />)

const Loglines = ({loglines}) =>
  <ul className={loglinesStyle}>
    {loglines ? createLines(loglines) : null}
  </ul>

export default Loglines
