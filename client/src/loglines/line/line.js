import React from 'react';

const Line = ({props}) =>
  <li className={props.classStr}>
    <span className="line">{props.line}</span>
    <span className="text">{props.text}</span>
  </li>;

export default Line;
