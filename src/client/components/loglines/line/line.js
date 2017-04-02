import React from 'react';

import { levels, defaultLevel } from '../../../../constants'

import { left, text, line, debug, info, warn, error } from './line.css';

function getLevelStyle(level, levelEnum){
  switch(level){
    case levelEnum.debug:
      return debug;
    break;
    case levelEnum.info:
      return info;
    break;
    case levelEnum.warn:
      return warn
    break;
    case levelEnum.error:
      return error
    default:
      return defaultLevel
  }
}

const Line = ({props}) =>
  <li className={line}>
    <div className={left}>
      <div className="datetime">{props.datetimeStr}</div>
      <div className={getLevelStyle(props.level, levels)}>{props.levelStr}</div>
    </div>
    <div className={text}>{props.text}</div>
  </li>;

export default Line;
