import { colours } from '../../globals.config'
import { sizes } from './buttons.config'

const base = Object.assign({
  border: 0
}, sizes)

export const round = Object.assign({
  background: colours.blue,
  borderRadius: '50%'
}, base)
