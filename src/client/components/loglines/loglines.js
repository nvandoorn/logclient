import React from 'react'
import { loglines as loglinesStyle } from './loglines.css'
import Line from './line/line'

const Loglines = ({loglines}) =>
  <ul className={loglinesStyle}>
    { loglines.map((logline, i) => <Line props={logline} key={i} />) }
  </ul>

export default Loglines
