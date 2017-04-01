import React from 'react';
import { Row } from 'react-bootstrap';

import Line from './line/line';

let i = 0;
let getKey = () => `line-${i++}`; // TODO dejank this
const createLines = loglines => loglines.map(logline => <Line props={logline} key={getKey()}/>);

const Loglines = ({loglines}) =>
  <Row>
    <ul className="loglines">
      {loglines ? createLines(loglines) : null}
    </ul>
  </Row>;

export default Loglines;
