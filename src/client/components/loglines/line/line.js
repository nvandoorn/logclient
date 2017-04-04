import React from 'react'

import { levels } from '../../../../constants'

import { left, text, line, debug, info, warn, error, verbose } from './line.css'

function getLevelStyle (level, levelEnum) {
  switch (level) {
    case levelEnum.debug:
      return debug
    case levelEnum.info:
      return info
    case levelEnum.warn:
      return warn
    case levelEnum.error:
      return error
    case levelEnum.verbose:
      return verbose
    default:
      return debug // TODO this should be linked to the constants file
  }
}

const Line = ({props}) =>
  <li className={line}>
    <div className={left}>
      <div className='datetime'>{props.datetimeStr}</div>
      <div className={getLevelStyle(props.level, levels)}>{props.levelStr}</div>
    </div>
    <div className={text}>{props.text}</div>
  </li>

export default Line
