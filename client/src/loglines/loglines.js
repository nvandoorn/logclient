import React from 'react';

import Line from './line/line';

function createLines(loglines){
  const lines = [];
  for(let line of loglines){
    const key = line.line;
    lines.push(<Line props={line} key={key}/>);
  }
  return lines;
}

const Loglines = ({loglines}) =>
  <ul className="loglines">
    {loglines ? createLines(loglines) : null}
  </ul>;

export default Loglines;