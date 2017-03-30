import React from 'react';

const Line = ({props}) =>
  <li className={props.classStr}>
    <div className="left">
      <span className="level">{props.levelStr}</span>
      <span className="datetime">{props.datetimeStr}</span>
    </div>
    <div className="text">{props.text}</div>
  </li>;

export default Line;
