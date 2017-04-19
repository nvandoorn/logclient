import React from 'react'

import { loglines as loglinesStyle } from './loglines.css'

import Line from './line/line'

const createLines = (loglines, i) => loglines.map(logline => <Line props={logline} key={i} />)

const Loglines = ({loglines}) =>
  <ul className={loglinesStyle}>
    {loglines ? createLines(loglines) : null}
  </ul>

export default Loglines
