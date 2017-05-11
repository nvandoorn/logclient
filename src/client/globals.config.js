// TODO figure out why import/export is borked in this file
const levels = require('../constants').levels

const colours = {
  blue: '#58B3FC',
  lightBlue: '#51F2FC',
  teal: '#34989F',
  orange: '#F0C850',
  red: '#F35656',
  gray: '#40454E',
  darkGray: '#262A32'
}

exports.colours = Object.assign({
  loglevels: [
    { level: levels.debug, colour: colours.teal },
    { level: levels.info, colour: colours.blue },
    { level: levels.warn, colour: colours.orange },
    { level: levels.error, colour: colours.red },
    { level: levels.verbose, colour: colours.lightBlue }
  ],
  background: {
    main: colours.gray,
    accent: colours.darkGray
  },
  text: {
    main: '#FFFFFF',
    muted: '#CCCCCC'
  }
}, colours)

exports.sizes = {
  padding: '20px',
  margin: '20px',
  borderRadius: '3px',
  calendar: {
    padding: '7px 3px',
    borderRadius: '1.5px',
    border: '1px solid'
  }
}

exports.fontSizes = {
  calendar: {
    daysOfWeek: '0.75em',
    days: '0.8em'
  }
}
