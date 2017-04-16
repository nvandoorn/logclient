// TODO figure out why import/export is borked in this file
const levels = require('../constants').levels

exports.colours = {
  loglevels: [
    { level: levels.debug, colour: '#34989F' },
    { level: levels.info, colour: '#58B3FC' },
    { level: levels.warn, colour: '#F0C850' },
    { level: levels.error, colour: '#F35656' },
    { level: levels.verbose, colour: '#51F2FC' }
  ],
  background: {
    main: '#40454E',
    accent: '#262A32'
  },
  text: {
    main: '#FFFFFF'
  }
}

exports.sizes = {
  padding: '20px',
  margin: '20px',
  borderRadius: '3px'
}
