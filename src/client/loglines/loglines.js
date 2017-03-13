import React from 'react';
import { Row } from 'react-bootstrap';

import Line from './line/line';

const createLines = loglines => loglines.map(logline => <Line props={logline} key={logline.line}/>);

const Loglines = ({loglines}) =>
  <Row>
    <ul className="loglines">
      {loglines ? createLines(loglines) : null}
    </ul>
  </Row>;

export default Loglines;
